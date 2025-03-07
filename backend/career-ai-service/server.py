from flask import Flask, request, jsonify, send_from_directory, after_this_request
from flask_cors import CORS
import logging
import json
import os
from dotenv import load_dotenv
from api.prompt_manager import extract_career_goal, generate_topic_reports
from api.gemini_client import setup_gemini_api
from api.assessment_manager import AssessmentManager
from reports.report_builder import build_report_data
from reports.pdf_generator import generate_pdf_report

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s: %(message)s',
    handlers=[logging.FileHandler('career_guidance.log'), logging.StreamHandler()]
)

app = Flask(__name__)
CORS(app)

# Initialize services
assessment_manager = AssessmentManager()

# Configure Gemini API on startup
try:
    setup_gemini_api()
except Exception as e:
    logging.error(f"Failed to initialize Gemini API: {str(e)}")
    exit(1)

# Define report storage directory
REPORTS_DIR = "E:/career-guide/backend/career-ai-service/reportss"
os.makedirs(REPORTS_DIR, exist_ok=True)

@app.route('/api/submit-assessment', methods=['POST'])
def submit_assessment():
    """Handle assessment submission and generate career report."""
    try:
        data = request.get_json()
        
        if not data or 'answers' not in data:
            return jsonify({"error": "Missing answers data"}), 400
            
        if not isinstance(data['answers'], dict):
            return jsonify({"error": "Invalid answers format"}), 400
            
        # Calculate trait scores
        trait_scores = assessment_manager.calculate_scores(data['answers'])
        
        # Extract student information
        student_name = data.get('studentName', 'Student').strip()
        student_info = {
            'name': student_name,
            'age': str(data.get('age', 'Not provided')),
            'academic_info': str(data.get('academicInfo', 'Not provided')),
            'interests': str(data.get('interests', 'Not provided')),
            'achievements': [
                str(data.get('answers', {}).get('question13', 'None')),
                str(data.get('answers', {}).get('question30', 'None'))
            ]
        }
        
        # Extract career goal
        career_goal = extract_career_goal(list(data['answers'].values()))
        if not career_goal:
            return jsonify({"error": "Failed to extract career goal"}), 500
        
        # Generate report sections
        context = f"""
        Trait Scores: {json.dumps(trait_scores)}
        Student Info: {json.dumps(student_info)}
        """
        report_sections = generate_topic_reports(context.strip(), career_goal, student_info['name'])
        
        if not report_sections:
            return jsonify({"error": "Failed to generate report sections"}), 500
        
        # Build report data
        report_data = build_report_data(student_info['name'], career_goal, report_sections)

        # Generate the filename
        pdf_filename = f"{student_name.replace(' ', '_')}_Career_Report.pdf"
        pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

        # Generate the PDF
        generate_pdf_report(report_data, pdf_path)

        return jsonify({
            "message": "Report generated successfully",
            "report_url": f"/api/download-report/{pdf_filename}"
        }), 200

    except Exception as e:
        logging.error(f"Assessment submission error: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Assessment processing failed",
            "details": str(e)
        }), 500

@app.route('/api/download-report/<filename>', methods=['GET'])
def download_report(filename):
    """Serve the generated career report PDF."""
    try:
        file_path = os.path.join(REPORTS_DIR, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
        
        return send_from_directory(REPORTS_DIR, filename, as_attachment=True)

    except Exception as e:
        logging.error(f"Error serving report {filename}: {str(e)}", exc_info=True)
        return jsonify({"error": "Failed to retrieve report"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=False)
