import os
from openai import AzureOpenAI
import json

# Access secrets from Hugging Face environment
AZURE_API_KEY = os.getenv("AZURE_API_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")
API_VERSION = os.getenv("API_VERSION")
MODEL_NAME = os.getenv("MODEL_NAME")

# Use AzureOpenAI instead of OpenAI
client = AzureOpenAI(
    api_key=AZURE_API_KEY,
    azure_endpoint=AZURE_ENDPOINT,  # Use azure_endpoint instead of base_url
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
    - reason: 15-word explanation
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
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"API Error: {str(e)}")
        return {
            "status": "Immediate Attention",
            "reason": "Requires professional evaluation",
            "food": "Maintain balanced diet",
            "exercise": "Consult doctor"
        }