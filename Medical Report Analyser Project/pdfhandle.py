# pdfhandle.py (Revised)
import pdfplumber
import re
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_medical_pdf(pdf_file):
    """Robust PDF parser for medical reports"""
    results = []
    header_found = False
    header_pattern = re.compile(
        r'TEST\s+NAME\s+OBSERVED\s+VALUE\s+UNITS\s+BIO\.?\s+REF\.?\s*INTERVAL',
        re.IGNORECASE
    )
    
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
                    break
                
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
                            "test": data['test'],
                            "value": data['value'],
                            "reference": f"{data['ref']} {data['units']}"
                        })
                        logger.info(f"Valid row: {data}")
                    else:
                        logger.warning(f"Skipped line: {line}")
    
    return results