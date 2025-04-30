# pdfhandle.py (Enhanced with AI fallback)
import pdfplumber
import re
import logging
import os
from langchain_community.chat_models import AzureChatOpenAI
#from langchain.chat_models import AzureChatOpenAI
from langchain.schema import HumanMessage
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicalParameter(BaseModel):
    test: str = Field(description="Name of the medical test")
    value: str = Field(description="Observed value of the test")
    reference: str = Field(description="Reference range with units if available")

class MedicalReport(BaseModel):
    parameters: List[MedicalParameter] = Field(description="List of medical parameters from the report")

def parse_medical_pdf(pdf_file):
    """Enhanced PDF parser with AI fallback for medical reports"""
    # First attempt with regex-based parsing
    results = standard_parse(pdf_file)
    
    # If standard parsing yields no results, try AI-based parsing
    if not results:
        logger.info("Standard parsing yielded no results. Trying AI-based parsing...")
        results = ai_based_parse(pdf_file)
    
    return results

def standard_parse(pdf_file):
    """Standard regex-based parsing method"""
    results = []
    header_found = False
    header_pattern = re.compile(
        r'TEST\s+NAME\s+OBSERVED\s+VALUE\s+UNITS\s+BIO\.?\s+REF\.?\s*INTERVAL',
        re.IGNORECASE
    )
    
    # Extended pattern to handle common variations in medical reports
    data_pattern = re.compile(
        r'^(?P<test>.+?)\s+'          # Test name (non-greedy match)
        r'(?P<value>\d+\.?\d*)\s+'    # Numeric value
        r'(?P<units>[^\s]+)\s+'       # Units (no spaces)
        r'(?P<ref>.+)$'               # Reference range
    )

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            
            for line in lines:
                # Skip disclaimers and empty lines
                if not line or line.startswith('Disclaimer'):
                    continue
                
                # Detect header row
                if header_pattern.search(line):
                    header_found = True
                    logger.info(f"Header found: {line}")
                    continue
                
                if header_found:
                    # Skip section headers (all caps without numbers)
                    if re.match(r'^[A-Z\s/]+$', line) and not re.search(r'\d', line):
                        logger.debug(f"Skipping section: {line}")
                        continue
                    
                    # Extract data using regex
                    if match := data_pattern.match(line):
                        data = match.groupdict()
                        results.append({
                            "test": data['test'].strip(),
                            "value": data['value'],
                            "reference": f"{data['ref']} {data['units']}".strip()
                        })
                        logger.info(f"Valid row: {data}")
                    else:
                        logger.debug(f"Skipped line: {line}")
    
    return results

def ai_based_parse(pdf_file):
    """AI-based parsing using LangChain and Azure OpenAI"""
    try:
        # Configure Azure OpenAI client
        llm = AzureChatOpenAI(
            openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
            azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
            openai_api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        
        # Extract text from PDF
        full_text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                full_text += page.extract_text() + "\n"
        
        # Define the output parser
        parser = PydanticOutputParser(pydantic_object=MedicalReport)
        
        # Create the prompt
        prompt = f"""
        You are a medical data extraction expert. Extract all medical test parameters from this report.
        
        Medical Report Text:
        {full_text}
        
        Extract each test with its observed value and reference range. Format your response exactly as in this example:
        {{
            "parameters": [
                {{
                    "test": "Hemoglobin",
                    "value": "14.5",
                    "reference": "13.0 - 17.0 g/dL"
                }},
                {{
                    "test": "Total Cholesterol",
                    "value": "198",
                    "reference": "<200 mg/dL"
                }}
            ]
        }}
        
        Extract only actual test parameters. Include units in the reference field.
        {parser.get_format_instructions()}
        """
        
        # Get response from the LLM
        messages = [HumanMessage(content=prompt)]
        response = llm.predict_messages(messages)
        
        # Parse the response
        report = parser.parse(response.content)
        
        # Convert to the expected format
        results = []
        for param in report.parameters:
            results.append({
                "test": param.test,
                "value": param.value,
                "reference": param.reference
            })
        
        logger.info(f"AI parsing successful. Extracted {len(results)} parameters.")
        return results
        
    except Exception as e:
        logger.error(f"AI-based parsing failed: {str(e)}")
        return []