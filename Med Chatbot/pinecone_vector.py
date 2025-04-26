import os
from pinecone import Pinecone, ServerlessSpec
from langchain.vectorstores import Pinecone as LangchainPinecone

def init_pinecone(embeddings, index_name="medical-chatbot"):
    # Create an instance of the Pinecone client using your API key.
    pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
    
    # Check if the index exists. list_indexes() returns an object with a .names() method.
    if index_name not in pc.list_indexes().names():
        # Create the index with the appropriate dimension and metric.
        # Adjust the 'cloud' parameter if needed (e.g., 'aws' or 'gcp').
        pc.create_index(
            name=index_name,
            dimension=768,  # For sentence-transformers/all-mpnet-base-v2 embeddings
            metric="cosine",
            spec=ServerlessSpec(
                cloud='aws',  # Change if you're using a different cloud provider
                region=os.environ.get("PINECONE_ENVIRONMENT", "us-east-1")
            )
        )
    
    # Return a Langchain wrapper around the existing Pinecone index.
    return LangchainPinecone.from_existing_index(index_name, embeddings)
