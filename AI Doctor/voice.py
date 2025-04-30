# voice.py (Updated with Azure OpenAI integration)
import os
import speech_recognition as sr
import google.generativeai as genai
import tempfile
import logging
from io import BytesIO
import re
import pygame
from translate import Translator
import base64
import streamlit as st
from google.cloud import texttospeech
import json
from openai import AzureOpenAI

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Get API keys from environment variables
gemini_api_key = os.getenv('GEMINI_API_KEY', "AIzaSyCZL29aqWTmP_NTzkGILK4Kujx_MuyRAs4")
google_tts_credentials = os.getenv('GOOGLE_TTS_CREDENTIALS', "D:/AI and Data Science/Projects/AI DoctorV2/tamiltextspeech-458116-147b3efcaf84.json")

# Azure OpenAI configuration
AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
MODEL_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

# Initialize Azure OpenAI client
try:
    azure_client = AzureOpenAI(
        api_key=AZURE_API_KEY,
        azure_endpoint=AZURE_ENDPOINT,
        api_version=API_VERSION
    )
    logger.info("Azure OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Azure OpenAI client: {str(e)}")
    azure_client = None

# Initialize Google TTS client
try:
    # Set credentials from JSON file
    if os.path.exists(google_tts_credentials):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_tts_credentials
        tts_client = texttospeech.TextToSpeechClient()
        logger.info("Google Text-to-Speech client initialized successfully")
    else:
        logger.warning(f"Google TTS credentials file not found: {google_tts_credentials}")
        tts_client = None
except Exception as e:
    logger.error(f"Failed to initialize Google TTS: {str(e)}")
    tts_client = None

# Configure Gemini for translations only
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-1.5-pro')

def listen_tamil():
    """Listen to Tamil speech with improved end detection and error handling"""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        logger.info("Listening for Tamil speech...")
        # Adjust for ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=1.5)  # Increased duration
        
        # Improve speech detection with better pause threshold
        recognizer.pause_threshold = 1.0  # Increased pause threshold for better recognition
        recognizer.energy_threshold = 300  # Adjust sensitivity
        
        try:
            st.info("🎤 Listening... Please speak in Tamil")
            audio = recognizer.listen(source, timeout=15, phrase_time_limit=30)  # Extended timeout
            logger.info("Speech detected, processing...")
            st.success("✅ Speech recorded! Processing...")
        except sr.WaitTimeoutError:
            logger.error("No speech detected")
            st.error("❌ No speech detected. Please try again.")
            return None
    
    try:
        # Using Google's speech recognition with Tamil language
        tamil_text = recognizer.recognize_google(audio, language='ta-IN')
        logger.info(f"Recognized Tamil text: {tamil_text}")
        return tamil_text
    except sr.UnknownValueError:
        logger.error("Could not understand audio")
        st.error("❌ Could not understand the speech. Please try again more clearly.")
        return None
    except sr.RequestError as e:
        logger.error(f"Speech recognition service error: {e}")
        st.error("❌ Speech recognition service error. Please try again later.")
        return None

def translate_tamil_to_english(tamil_text):
    """Translate Tamil text to English while preserving numbers"""
    if not tamil_text:
        return ""
        
    # Extract numbers from the text
    numbers = re.findall(r'\d+\.?\d*', tamil_text)
    
    # Replace numbers with placeholders
    for i, num in enumerate(numbers):
        tamil_text = tamil_text.replace(num, f'NUM{i}PLACEHOLDER')
    
    try:
        # Use Gemini for more accurate translation
        prompt = f"""Translate this Tamil text to English accurately, preserving the exact meaning:
        
        {tamil_text}
        
        Return only the translation, nothing else."""
        
        response = model.generate_content(prompt)
        translation = response.text
        
        # Fallback to basic translator if Gemini fails
        if not translation or len(translation) < 5:
            translator = Translator(to_lang="en", from_lang="ta")
            translation = translator.translate(tamil_text)
    
        # Restore numbers
        for i, num in enumerate(numbers):
            translation = translation.replace(f'NUM{i}PLACEHOLDER', num)
            
        # Clean up any artifacts
        translation = re.sub(r'\s+', ' ', translation).strip()
        logger.info(f"Translation result: {translation}")
        
        return translation
        
    except Exception as e:
        logger.error(f"Translation error: {e}")
        # Try fallback translator
        try:
            translator = Translator(to_lang="en", from_lang="ta")
            return translator.translate(tamil_text)
        except:
            return tamil_text  # Return original if translation fails

def translate_english_to_tamil(english_text):
    """Translate English text to Tamil while preserving numbers"""
    if not english_text:
        return ""
        
    # Extract numbers from the text
    numbers = re.findall(r'\d+\.?\d*', english_text)
    
    # Replace numbers with placeholders
    for i, num in enumerate(numbers):
        english_text = english_text.replace(num, f'NUM{i}PLACEHOLDER')
    
    try:
        # Use Gemini for more accurate translation
        prompt = f"""Translate this English text to Tamil accurately, preserving the exact meaning:
        
        {english_text}
        
        Return only the translation, nothing else."""
        
        response = model.generate_content(prompt)
        translation = response.text
        
        # Fallback to basic translator if Gemini fails
        if not translation or len(translation) < 5:
            translator = Translator(to_lang="ta", from_lang="en")
            translation = translator.translate(english_text)
    
        # Restore numbers
        for i, num in enumerate(numbers):
            translation = translation.replace(f'NUM{i}PLACEHOLDER', num)
            
        # Clean up any artifacts
        translation = re.sub(r'\s+', ' ', translation).strip()
        logger.info(f"Translation to Tamil: {translation}")
        
        return translation
        
    except Exception as e:
        logger.error(f"Translation error: {e}")
        # Try fallback translator
        try:
            translator = Translator(to_lang="ta", from_lang="en")
            return translator.translate(english_text)
        except:
            return english_text  # Return original if translation fails

def process_with_azure_openai(english_text, medical_summary):
    """Process medical report with Azure OpenAI using empathetic approach"""
    if not english_text or not medical_summary:
        return "No data available to process."
    
    if not azure_client:
        logger.error("Azure OpenAI client not initialized")
        return "Sorry, the AI service is currently unavailable."
    
    try:
        prompt = f"""You are a compassionate medical assistant. Analyze the medical report and respond to the user's question.

        User's question: {english_text}
        
        Requirements:
        1. Respond only if the question relates to the medical report
        2. Keep the response under 100 words
        3. Use simple, non-medical language when possible
        4. Focus on answering the specific question
        5. Be empathetic and reassuring (avoid causing panic)
        6. Include positive, actionable health improvement suggestions
        7. Use phrases like "Don't worry", "You can improve this by", "This is manageable"
        
        Medical Report:
        {medical_summary}
        """
        
        response = azure_client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=400
        )
        
        processed_text = response.choices[0].message.content
        logger.info("Successfully processed query with Azure OpenAI")
        return processed_text
        
    except Exception as e:
        logger.error(f"Error processing with Azure OpenAI: {str(e)}")
        return "I apologize, but I couldn't process your question about the medical report."

def text_to_speech(text, output_file="output.mp3"):
    """Convert text to speech using Google TTS"""
    if not text:
        logger.warning("No text provided for speech synthesis")
        return None
        
    try:
        if tts_client:
            # Configure the synthesis input
            synthesis_input = texttospeech.SynthesisInput(text=text)
            
            # Build the voice request, selecting Tamil language and female voice
            voice = texttospeech.VoiceSelectionParams(
                language_code="ta-IN",
                ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
            )
            
            # Select the audio file type with improved settings
            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
                speaking_rate=0.9,  # Slightly slower for better comprehension
                pitch=0.0,  # Normal pitch
                volume_gain_db=1.0  # Slightly louder
            )
            
            # Perform the text-to-speech request
            response = tts_client.synthesize_speech(
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )
            
            # Save the response to a file
            with open(output_file, "wb") as out:
                out.write(response.audio_content)
                logger.info(f"Audio content written to file {output_file}")
            
            # Return audio bytes for streaming
            audio_bytes = BytesIO(response.audio_content)
            return audio_bytes
        else:
            logger.warning("Google TTS client not available")
            return None
            
    except Exception as e:
        logger.error(f"Error in text-to-speech: {e}")
        return None

def play_audio(audio_file):
    """Play audio file using pygame"""
    try:
        pygame.mixer.init()
        pygame.mixer.music.load(audio_file)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
    except Exception as e:
        logger.error(f"Error playing audio: {e}")

def get_base64_audio(audio_file):
    """Convert audio file to base64 for embedding"""
    with open(audio_file, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

def play_audio_response(audio_file):
    """Play audio file automatically in browser"""
    if audio_file and os.path.exists(audio_file):
        try:
            # Create HTML with autoplay audio element
            audio_html = f"""
            <audio id="response_audio" autoplay="true">
                <source src="data:audio/mp3;base64,{get_base64_audio(audio_file)}" type="audio/mp3">
            </audio>
            <script>
                // Ensure audio plays automatically
                var audio = document.getElementById("response_audio");
                audio.play().catch(function(error) {{
                    console.error("Audio playback failed:", error);
                }});
            </script>
            """
            st.components.v1.html(audio_html, height=0)
            logger.info("Audio playback triggered")
        except Exception as e:
            logger.error(f"Error in auto-play: {e}")

def get_medical_report_answer(medical_summary, tamil_text=None):
    """Process a voice query about the medical report"""
    # If tamil_text is not provided, listen for it
    if not tamil_text:
        tamil_text = listen_tamil()
        
    if not tamil_text:
        return {
            "original_query": None,
            "translated_query": None,
            "english_response": "No speech detected. Please try again.",
            "tamil_response": "பேச்சு இல்லை. மீண்டும் முயற்சிக்கவும்.",
            "audio_file": None
        }
    
    # Step 2: Translate Tamil to English
    english_query = translate_tamil_to_english(tamil_text)
    
    # Step 3: Process with Azure OpenAI instead of Gemini
    english_response = process_with_azure_openai(english_query, medical_summary)
    
    # Step 4: Translate response back to Tamil
    tamil_response = translate_english_to_tamil(english_response)
    
    # Add empathetic phrases in Tamil if they're not already present
    empathetic_phrases = [
        "கவலைப்பட வேண்டாம்",  # Don't worry
        "இது கையாளக்கூடியது",   # This is manageable
        "இதை மேம்படுத்த முடியும்"  # You can improve this
    ]
    
    # Check if at least one empathetic phrase is present
    has_empathetic_phrase = any(phrase in tamil_response for phrase in empathetic_phrases)
    
    # Add an empathetic phrase at the beginning if none found
    if not has_empathetic_phrase:
        tamil_response = f"{empathetic_phrases[0]}. {tamil_response}"
    
    # Step 5: Convert to speech
    audio_file = "response_audio.mp3"
    audio_data = text_to_speech(tamil_response, audio_file)
    
    # Log success or failure of audio generation
    if audio_data:
        logger.info("Audio response generated successfully")
    else:
        logger.warning("Failed to generate audio response")
        
    return {
        "original_query": tamil_text,
        "translated_query": english_query,
        "english_response": english_response,
        "tamil_response": tamil_response,
        "audio_file": audio_file if audio_data else None
    }