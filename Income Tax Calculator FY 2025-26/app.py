import streamlit as st
import json
from calculation import calculate_tax
import datetime
import gspread
from google.oauth2.service_account import Credentials

# Title of the app
st.title("Income Tax Calculator (FY 2025-26)")

# Tooltip/info about privacy – no PII is collected.
st.markdown(
    '<span title="This is for educational purposes and the calculations may not be accurate for all sections. We do not collect any PII.">ℹ️ </span>',
    unsafe_allow_html=True
)

# Create a form for user input and submission.
with st.form(key='tax_form'):
    user_input = st.text_input("Enter Your Gross Salary (e.g., 1300000 or 13,00,000):")
    submit_button = st.form_submit_button(label='Submit')

if submit_button and user_input:
    # Convert the input into a standard number format.
    user_input = user_input.replace(",", "").replace("L", "00000").replace("lakhs", "00000").replace(" ", "")
    
    try:
        salary = int(user_input)
        st.write("Tax Breakdown:")
        st.write("-" * 20)
        
        # Call the tax calculation function from calculation.py
        result = calculate_tax(salary)
        st.markdown(f"```\n{result}\n```")
        
        # Capture the current timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Append the salary and timestamp to Google Sheets.
        # Make sure your service account credentials are in 'creds.json'
        # and that you have shared your target Google Sheet with your service account email.
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        # Try to load credentials from Hugging Face Spaces secrets
        if "GOOGLE_CREDS" in st.secrets:
        # Parse the JSON content stored in the secret
            service_account_info = json.loads(st.secrets["GOOGLE_CREDS"])
            credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
        else:
        # Fallback for local testing: load from local creds.json file.
            credentials = Credentials.from_service_account_file('creds.json', scopes=scopes)

        # Authorize gspread with the credentials
        gc = gspread.authorize(credentials)
        
        # Replace 'YourSheetName' with the name of your Google Sheet.
        sheet = gc.open("IncomeTaxEntry").sheet1
        sheet.append_row([salary, timestamp])
        
    except ValueError:
        st.error("Please enter a valid number format for salary.")

# Display LinkedIn profile
st.markdown(
    """
    <div style="text-align: center; font-size: 15px;">
        <a href="https://www.linkedin.com/in/tamilprabaharan/" target="_blank">Visit my LinkedIn Profile</a>
    </div>
    """, 
    unsafe_allow_html=True
)
