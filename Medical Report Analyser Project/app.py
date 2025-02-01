import streamlit as st
from pdfhandle import parse_medical_pdf
from analyze import analyze_parameter

st.set_page_config(
    page_title="Health Report Analyzer",
    layout="wide",
    page_icon="🩺"
)

# Custom title with enhanced styling
st.markdown("""
    <h1 style='text-align: center; color: #2a5c8a; font-size: 2.5em; 
    margin-bottom: 30px;'>
    Medical Report Analysis and Recommendations
    </h1>
""", unsafe_allow_html=True)

# File upload with 10MB limit
uploaded_file = st.file_uploader(
    "Upload Medical Report (PDF, max 10MB)", 
    type="pdf",
    help="We never store your medical data",
    accept_multiple_files=False
)

if uploaded_file:
    if uploaded_file.size > 10 * 1024 * 1024:
        st.error("❌ File size exceeds 10MB limit")
        st.stop()
    
    with st.spinner("Analyzing your report..."):
        try:
            # Process PDF
            raw_data = parse_medical_pdf(uploaded_file)
            
            if not raw_data:
                st.error("No parameters found in document")
                st.stop()
            
            # Process analysis
            categorized = {
                "Good": [],
                "Moderate": [],
                "Immediate Attention": []
            }
            
            for item in raw_data:
                analysis = analyze_parameter(
                    item["test"], 
                    item["value"], 
                    item["reference"]
                )
                row = {
                    "Parameter": item["test"],
                    "Value": f"{item['value']} (Ref: {item['reference']})",
                    "Reason": analysis["reason"],
                    "Food": analysis["food"],
                    "Exercise": analysis["exercise"]
                }
                categorized[analysis["status"]].append(row)
            
            # Display results
            st.success("Analysis Complete!")
            st.warning("❗ This tool provides general insights only. Always consult a healthcare professional.")
            
            for status in ["Good", "Moderate", "Immediate Attention"]:
                if data := categorized[status]:
                    st.subheader(f"{status} Parameters ({len(data)})")
                    st.dataframe(
                        data,
                        column_config={
                            "Parameter": "Medical Parameter",
                            "Value": st.column_config.Column(
                                "Value with Reference",
                                help="Hover over values to see reference ranges"
                            ),
                            "Reason": "Clinical Significance",
                            "Food": "Dietary Recommendations",
                            "Exercise": "Activity Guidance"
                        },
                        use_container_width=True,
                        hide_index=True
                    )
            
        except Exception as e:
            st.error(f"Analysis failed: {str(e)}")