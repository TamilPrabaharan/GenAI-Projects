import streamlit as st
from dotenv import load_dotenv
from pdf_handler import process_pdf  # Ensure your file is named 'pdf_handler.py'
from embeddings_model import get_embeddings
from pinecone_vector import init_pinecone  # Ensure your file is named 'pinecone_vector.py' (or update import accordingly)
import os

load_dotenv()

# Streamlit UI Setup
st.set_page_config(page_title="Medical Chatbot", page_icon="🩺")
st.title("Medical ChatBot 💬")

# Initialize session state
if "conversation" not in st.session_state:
    st.session_state.conversation = None
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Sidebar for PDF upload
with st.sidebar:
    st.header("Upload Medical Documents")
    pdf_docs = st.file_uploader(
        "Upload PDF files and click 'Process'",
        type=["pdf"],
        accept_multiple_files=False
    )
    if st.button("Process"):
        with st.spinner("Processing..."):
            # Process PDF and split into chunks
            chunks = process_pdf(pdf_docs)
            
            # Create embeddings and initialize the vector store
            embeddings = get_embeddings()
            vector_store = init_pinecone(embeddings)
            
            # *** NEW: Insert the document chunks into Pinecone ***
            vector_store.add_texts(chunks)
            
            # Store the vector store in session state for later use
            st.session_state.conversation = vector_store
            st.success("PDF processed successfully!")

# Chat Interface
user_query = st.chat_input("Ask a medical question:")
if user_query:
    if st.session_state.conversation:
        # Perform similarity search on the vector store
        docs = st.session_state.conversation.similarity_search(
            user_query, 
            k=3
        )
        
        # Display user query
        with st.chat_message("user"):
            st.write(user_query)
        
        # Display results from Pinecone
        with st.chat_message("assistant"):
            for i, doc in enumerate(docs, 1):
                st.write(f"**Answer {i}:** {doc.page_content}")
                
        # Add the exchange to chat history
        st.session_state.chat_history.append({"user": user_query, "assistant": docs})
    else:
        st.warning("Please upload and process a PDF first!")
