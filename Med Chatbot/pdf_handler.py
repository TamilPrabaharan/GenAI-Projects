from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def process_pdf(pdf_file):
    # Extract text
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_text(text)
    return chunks