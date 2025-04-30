import os 
from openai import AzureOpenAI
import json
from dotenv import load_dotenv

# ✅ Load the .env file
load_dotenv()

# Access environment variables (works in both local + Hugging Face Spaces)
AZURE_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
MODEL_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")  # Default if not set

# Initialize AzureOpenAI client
client = AzureOpenAI(
    api_key=AZURE_API_KEY,
    azure_endpoint=AZURE_ENDPOINT,
    api_version=API_VERSION
)

def analyze_parameter(test_name, value, reference):
    """Get AI analysis with strict output control"""
    prompt = f"""Analyze this medical parameter:
    Test: {test_name}
    Value: {value}
    Reference: {reference}

    Return JSON with:
    - status: "Good"/"Moderate"/"Immediate Attention"
    - reason: 20-word explanation
    - food: 3 specific food items
    - exercise: 1 measurable activity

    Example: {{
        "status": "Immediate Attention",
        "reason": "High LDL increases cardiovascular risk",
        "food": "Oats, walnuts, olive oil",
        "exercise": "45-min daily brisk walking"
    }}"""

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            response_format={"type": "json_object"}
        )

        print(json.dumps(response.choices[0].message.content, indent=4))
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"API Error: {str(e)}")
        return {
            "status": "Immediate Attention",
            "reason": "Requires professional evaluation",
            "food": "Maintain balanced diet",
            "exercise": "Consult doctor"
        }

def generate_report_summary(raw_data):
    """Generate an overall summary of the medical report"""
    if not raw_data:
        return "No medical data found in the report."
    
    # Create a simplified list of parameters for the summary
    parameters = []
    for item in raw_data:
        parameters.append(f"{item['test']}: {item['value']} ({item['reference']})")
    
    parameters_text = "\n".join(parameters)
    
    prompt = f"""Generate a concise summary of this medical report:
    
    {parameters_text}
    
    Focus on:
    1. Overall health status
    2. Key areas of concern (if any)
    3. General health advice
    
    Keep it under 150 words, use simple language, and be honest but reassuring.
    """
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=300
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Summary generation error: {str(e)}")
        return "Unable to generate summary. Please review the detailed analysis of each parameter."