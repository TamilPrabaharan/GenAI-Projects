import streamlit as st
from pdfhandle import parse_medical_pdf
from analyze import analyze_parameter, generate_report_summary
from voice import get_medical_report_answer, play_audio_response
import os
import tempfile
import base64
import pandas as pd

st.set_page_config(
    page_title="AI Doctor",
    layout="wide",
    page_icon="🩺"
)

# Custom CSS for enhanced styling
st.markdown("""
<style>
    .main-header {
        text-align: center; 
        color: #1e4d8c; 
        font-size: 3em;
        margin-bottom: 5px;
        padding-top: 10px;
        font-weight: 700;
        font-family: 'Arial', sans-serif;
    }
    
    .tagline {
        text-align: center;
        color: #4a7bb7;
        font-size: 1.2em;
        margin-bottom: 30px;
        font-style: italic;
        font-weight: 400;
    }
    
    .icon-header {
        text-align: center;
        font-size: 2.5em;
        margin-bottom: 0;
    }
    
    .report-summary {
        background-color: #f8f9fa;
        border-left: 5px solid #1e4d8c;
        padding: 25px;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .subheader {
        color: #1e4d8c;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-top: 30px;
        font-weight: 600;
    }
    
    .good {
        background-color: #d4edda;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .moderate {
        background-color: #fff3cd;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .attention {
        background-color: #f8d7da;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .status-badge {
        padding: 5px 10px;
        border-radius: 15px;
        font-weight: bold;
        font-size: 0.85em;
    }
    
    .tab-content {
        padding: 25px 0;
    }
    
    .audio-player {
        margin-top: 20px;
        width: 100%;
        border-radius: 8px;
    }
    
    .dataframe {
        font-size: 0.9em;
    }
    
    .dataframe th {
        background-color: #e6f2ff;
        padding: 10px !important;
        text-align: left;
    }
    
    .dataframe td {
        padding: 10px !important;
    }
    
    .stButton > button {
        background-color: #1e4d8c;
        color: white;
        font-weight: 500;
        border-radius: 8px;
        padding: 10px 15px;
        border: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background-color: #0d3b76;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    
    .upload-section {
        background-color: #f0f7ff;
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 25px;
        text-align: center;
    }
    
    .query-box {
        background-color: #f0f7ff;
        border-left: 5px solid #1e4d8c;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .response-box {
        background-color: #f4f9f4;
        border-left: 5px solid #389738;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    .stTextInput > div > div > input {
        border-radius: 8px;
        border: 1px solid #bbd0e6;
        padding: 10px 15px;
    }
    
    .metric-card {
        background-color: #ffffff;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.3s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-5px);
    }
    
    .metric-good {
        border-top: 5px solid #28a745;
    }
    
    .metric-moderate {
        border-top: 5px solid #ffc107;
    }
    
    .metric-attention {
        border-top: 5px solid #dc3545;
    }
    
    .st-expander {
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    footer {
        text-align: center;
        padding: 20px 0;
        color: #6c757d;
        font-size: 0.9em;
    }
    
    .stTabs [data-baseweb="tab-list"] {
        gap: 20px;
    }
    
    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: #f8f9fa;
        border-radius: 4px 4px 0 0;
        gap: 1px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    
    .stTabs [aria-selected="true"] {
        background-color: #1e4d8c;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Header with icons and tagline
st.markdown('<div class="icon-header">👨‍⚕️ 🩺</div>', unsafe_allow_html=True)
st.markdown('<h1 class="main-header">AI Doctor</h1>', unsafe_allow_html=True)
st.markdown('<p class="tagline">Empowering people through AI-powered health insights in their native language</p>', unsafe_allow_html=True)

# Initialize session state for storing analysis results
if 'raw_data' not in st.session_state:
    st.session_state.raw_data = None
if 'categorized' not in st.session_state:
    st.session_state.categorized = None
if 'summary' not in st.session_state:
    st.session_state.summary = None
if 'voice_response' not in st.session_state:
    st.session_state.voice_response = None
# Add active tab tracking to session state
if 'active_tab' not in st.session_state:
    st.session_state.active_tab = 0

# Styled file upload section
st.markdown('<div class="upload-section">', unsafe_allow_html=True)
uploaded_file = st.file_uploader(
    "Upload Medical Report (PDF, max 10MB)", 
    type="pdf",
    help="We never store your medical data. All processing happens on-demand.",
    accept_multiple_files=False
)
st.markdown('</div>', unsafe_allow_html=True)

def get_binary_file_downloader_html(bin_file, file_label='File'):
    with open(bin_file, 'rb') as f:
        data = f.read()
    b64 = base64.b64encode(data).decode()
    href = f'<a href="data:audio/mp3;base64,{b64}" download="{file_label}.mp3" class="download-button">Download {file_label} 📥</a>'
    return href

# Function to update active tab in session state
def set_active_tab(tab_idx):
    st.session_state.active_tab = tab_idx

# Main application flow
if uploaded_file:
    if uploaded_file.size > 10 * 1024 * 1024:
        st.error("❌ File size exceeds 10MB limit")
        st.stop()
    
    # Only process the PDF if it hasn't been processed yet or a new file was uploaded
    file_hash = hash(uploaded_file.getvalue())
    if 'file_hash' not in st.session_state or file_hash != st.session_state.file_hash:
        with st.spinner("Analyzing your medical report..."):
            try:
                # Process PDF
                st.session_state.raw_data = parse_medical_pdf(uploaded_file)
                st.session_state.file_hash = file_hash
                
                if not st.session_state.raw_data:
                    st.error("No parameters found in document. Please ensure this is a standard medical report.")
                    st.stop()
                
                # Generate summary
                st.session_state.summary = generate_report_summary(st.session_state.raw_data)
                
                # Process analysis
                categorized = {
                    "Good": [],
                    "Moderate": [],
                    "Immediate Attention": []
                }
                
                for item in st.session_state.raw_data:
                    analysis = analyze_parameter(
                        item["test"], 
                        item["value"], 
                        item["reference"]
                    )
                    row = {
                        "Parameter": item["test"],
                        "Value": f"{item['value']} (Ref: {item['reference']})",
                        "Clinical Significance": analysis["reason"],
                        "Dietary Recommendation": analysis["food"],
                        "Activity Guidance": analysis["exercise"],
                        "Status": analysis["status"]
                    }
                    categorized[analysis["status"]].append(row)
                
                st.session_state.categorized = categorized
                
            except Exception as e:
                st.error(f"Analysis failed: {str(e)}")
                st.stop()
    
    # Create tabs with specified active tab from session state and improved icons
    tab_titles = ["📊 Summary", "🔍 Detailed Analysis", "🗣️ Voice Assistant"]
    
    # Create tab containers with the active tab selected
    active_tab_index = st.session_state.active_tab
    tabs = st.tabs(tab_titles)
    
    # Tab 1: Summary with enhanced cards
    with tabs[0]:
        st.markdown("<h2 class='subheader'>Report Summary</h2>", unsafe_allow_html=True)
        st.markdown(f"<div class='report-summary'>{st.session_state.summary}</div>", unsafe_allow_html=True)
        
        # Summary stats with improved metric cards
        st.markdown("<h3>Health Parameters Overview</h3>", unsafe_allow_html=True)
        col1, col2, col3 = st.columns(3)
        
        with col1:
            good_count = len(st.session_state.categorized["Good"])
            st.markdown(f"""
            <div class="metric-card metric-good">
                <h4>Good Parameters</h4>
                <h2>{good_count}</h2>
                <p>Normal range values</p>
            </div>
            """, unsafe_allow_html=True)
            
        with col2:
            moderate_count = len(st.session_state.categorized["Moderate"])
            st.markdown(f"""
            <div class="metric-card metric-moderate">
                <h4>Moderate Parameters</h4>
                <h2>{moderate_count}</h2>
                <p>Borderline values</p>
            </div>
            """, unsafe_allow_html=True)
            
        with col3:
            attention_count = len(st.session_state.categorized["Immediate Attention"])
            st.markdown(f"""
            <div class="metric-card metric-attention">
                <h4>Needs Attention</h4>
                <h2>{attention_count}</h2>
                <p>Critical values</p>
            </div>
            """, unsafe_allow_html=True)
    
    # Tab 2: Detailed Analysis with improved styling
    with tabs[1]:
        st.markdown("<h2 class='subheader'>Detailed Analysis</h2>", unsafe_allow_html=True)
        st.warning("❗ This tool provides general insights only. Always consult a healthcare professional.")
        
        # Create tables for each status category with improved styling
        for status in ["Immediate Attention", "Moderate", "Good"]:
            if data := st.session_state.categorized[status]:
                status_color = "attention" if status == "Immediate Attention" else "moderate" if status == "Moderate" else "good"
                status_icon = "⚠️" if status == "Immediate Attention" else "⚠️" if status == "Moderate" else "✅"
                
                with st.expander(f"{status_icon} {status} Parameters ({len(data)})", expanded=(status == "Immediate Attention")):
                    # Convert list of dictionaries to DataFrame for tabular display
                    df = pd.DataFrame(data)
                    
                    # Apply styling based on status
                    st.markdown(f"<div class='{status_color}'>", unsafe_allow_html=True)
                    st.dataframe(
                        df,
                        hide_index=True,
                        use_container_width=True
                    )
                    st.markdown("</div>", unsafe_allow_html=True)

    # Tab 3: Voice Assistant with improved layout
    with tabs[2]:
        st.markdown("<h2 class='subheader'>Voice Assistant (Tamil)</h2>", unsafe_allow_html=True)
        st.info("You can ask questions about your medical report in Tamil. The assistant will respond in Tamil.")
    
        # Create a placeholder for status messages
        status_placeholder = st.empty()
        
        # Remove doctor icon and adjust spacing
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Button for voice input
            if st.button("🎤 Ask Questions (you may speak in Tamil)", type="primary", key="listen_button"):
                # Update the active tab in session state
                st.session_state.active_tab = 2
                
                # Process voice input
                st.session_state.voice_response = get_medical_report_answer(st.session_state.summary)
                
                # Use JavaScript to ensure we stay on Voice Assistant tab
                st.components.v1.html("""
                <script>
                    // Wait a moment for the UI to update
                    setTimeout(function() {
                        // Select the Voice Assistant tab (index 2)
                        window.parent.document.querySelectorAll('[data-baseweb="tab"]')[2].click();
                    }, 100);
                </script>
                """, height=0)
        
        with col2:
            # Text input as an alternative with better styling
            tamil_text = st.text_input("💬 Or type your question in Tamil:", placeholder="என் இரத்த அழுத்தம் எப்படி உள்ளது?")
            if tamil_text and st.button("✓ Submit", key="submit_button"):
                # Update the active tab in session state
                st.session_state.active_tab = 2
                
                with st.spinner("Processing your query..."):
                    st.session_state.voice_response = get_medical_report_answer(st.session_state.summary, tamil_text)
                
                # Use JavaScript to ensure we stay on Voice Assistant tab
                st.components.v1.html("""
                <script>
                    // Wait a moment for the UI to update
                    setTimeout(function() {
                        // Select the Voice Assistant tab (index 2)
                        window.parent.document.querySelectorAll('[data-baseweb="tab"]')[2].click();
                    }, 100);
                </script>
                """, height=0)
        
        # Display voice response in a more visually appealing way
        if 'voice_response' in st.session_state and st.session_state.voice_response:
            response = st.session_state.voice_response
            
            # Clear any status messages
            status_placeholder.empty()
            
            # Original query display with improved styling
            if response["original_query"]:
                st.markdown("<h3>Your Question</h3>", unsafe_allow_html=True)
                
                st.markdown(f"""
                <div class="query-box">
                    <strong>Tamil:</strong> {response['original_query']}<br>
                    <strong>English:</strong> {response['translated_query']}
                </div>
                """, unsafe_allow_html=True)
            
            # Response display with improved styling
            st.markdown("<h3>Response</h3>", unsafe_allow_html=True)
            
            with st.expander("🇺🇸 English Response", expanded=False):
                st.markdown(f"<div class='response-box'>{response['english_response']}</div>", unsafe_allow_html=True)
                
            with st.expander("🇮🇳 Tamil Response", expanded=True):
                st.markdown(f"<div class='response-box'>{response['tamil_response']}</div>", unsafe_allow_html=True)
            
            # Audio playback with auto-play and improved styling
            if response["audio_file"] and os.path.exists(response["audio_file"]):
                st.markdown("<h3>🔊 Voice Response</h3>", unsafe_allow_html=True)
                
                # Auto-play the audio
                play_audio_response(response["audio_file"])
                
                # Display audio controls for manual replay
                st.audio(response["audio_file"])
                
                # Download button with better styling
                st.markdown(get_binary_file_downloader_html(response["audio_file"], 'Audio Response'), unsafe_allow_html=True)
    
    # We don't need complex JavaScript for tabs anymore since we're using direct click events
    # This is much simpler and more reliable

else:
    # Show info when no file is uploaded with more attractive layout
    st.info("Upload your medical report PDF to get started with your personalized health analysis")
    
    # Sample information about the app with better formatting
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div style="background-color: #f0f7ff; padding: 20px; border-radius: 10px; height: 100%;">
        <h3>How it works</h3>
        
        <ol style="margin-top: 15px;">
            <li><strong>Upload your medical report</strong> in PDF format</li>
            <li>Our AI analyzes each parameter and provides:
                <ul>
                    <li>Status classification</li>
                    <li>Clinical significance</li> 
                    <li>Dietary recommendations</li>
                    <li>Activity guidance</li>
                </ul>
            </li>
            <li><strong>Ask questions in Tamil</strong> about your report using voice or text</li>
        </ol>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div style="background-color: #f0f7ff; padding: 20px; border-radius: 10px; height: 100%;">
        <h3>Privacy & Security</h3>
        
        <ul style="margin-top: 15px;">
            <li>Your medical data is processed securely and never stored</li>
            <li>All analysis happens on-demand</li>
            <li>Voice data is only used for processing your queries</li>
            <li>We prioritize your data privacy and security</li>
        </ul>
        </div>
        """, unsafe_allow_html=True)

# Footer with improved styling
st.markdown("""
<footer>
    <hr style="margin: 20px 0;">
    <div>
        <p>AI Doctor © 2025 | Empowering people through AI-powered health insights</p>
        <p style="font-size: 0.8em; color: #999;">For educational purposes only. Always consult a healthcare professional for medical advice.</p>
    </div>
</footer>
""", unsafe_allow_html=True)

# Display LinkedIn profile
st.markdown(
    """
    <div style="text-align: center; font-size: 15px;">
        <a href="https://www.linkedin.com/in/tamilprabaharan/" target="_blank">Visit my LinkedIn Profile</a>
    </div>
    """, 
    unsafe_allow_html=True
)