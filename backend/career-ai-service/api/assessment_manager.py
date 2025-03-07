import json
from typing import Dict, List, Union
import os
import logging

class AssessmentManager:
    def __init__(self):
        # Complete trait_scores dictionary including all traits
        self.trait_scores = {
            # [Previous trait dictionary entries remain the same...]
            'Logical Thinking': 0,
            'Analytical Abilities': 0,
            'Verbal Skills': 0,
            'Creative Thinking': 0,
            'Learning Speed': 0,
            'Problem-solving Abilities': 0,
            'Critical Thinking': 0,
            'Spatial Reasoning': 0,
            'People Skills': 0,
            'Sports Participation': 0,
            'Physical Activity': 0,
            'Leadership Roles': 0,
            'Teamwork': 0,
            'Clubs/Interest Groups': 0,
            'Technological Affinity': 0,
            'Social Engagement': 0,
            'Volunteering and Social Engagement': 0,
            'Social Responsibility': 0,
            'Awards and Recognitions': 0,
            'Online Certifications': 0,
            'Competitions/Olympiads': 0,
            'Independence': 0,
            'Risk-taking': 0,
            'Communication Skills': 0,
            'Work Ethic': 0,
            'Planning': 0,
            'Discipline': 0,
            'Career Interest Surveys': 0,
            'Digital Footprint': 0,
            'Online Presence': 0,
            'Nature Smartness': 0,
            'Picture Smartness': 0,
            'Music Smartness': 0,
            'Memory Smartness': 0,
            'Adaptability': 0,
            'Resilience': 0,
            'Empathy': 0,
            'Decisiveness': 0,
            'Passive Activity': 0,
            'Grade Trends': 0,
            'Interest in Specific Subjects': 0,
            'Technical Skills': 0,
            'Attention to Detail': 0,
            'Creativity': 0,
            'Artistic Skills': 0,
            'Social Awareness': 0,
            'Leadership': 0,
            'Decision Making': 0,
            'Collaboration': 0,
            'Self-reliance': 0,
            'Math Skills': 0,
            'Writing Skills': 0,
            'Physical Skills': 0,
            'Hand-eye Coordination': 0,
            'Stability Seeking': 0,
            'Financial Management': 0,
            'Solitary Work': 0,
            'Sustainability': 0,
            'Logic': 0,
            'Curiosity': 0,
            'Financial Literacy': 0,
            'Conventional Thinking': 0,
            'Independent Thinking': 0,
            'Science and Research': 0,
            'Public Speaking': 0,
            'Networking': 0,
            'Aesthetic Sense': 0,
            'Market Dynamics': 0,
            'Economics': 0,
            'Artistic Expression': 0,
            'Creative Freedom': 0,
            'Emotional Intelligence': 0,
            'Negotiation': 0,
            'Humanitarian Work': 0,
            'Research Skills': 0,
            'Business Acumen': 0,
            'Service Orientation': 0,
            'Written Communication': 0,
            'Physical Endurance': 0,
            'Machine Learning': 0,
            'Designing': 0,
            'Comfort with Technology': 0,
            'Social Interaction': 0,
            'Confidence': 0,
            'Creative Problem Solving': 0,
            'Future-Oriented Thinking': 0,
            'Listening Skills': 0,
            'Crisis Management': 0,
            'People Management': 0,
            'Arts and Humanities': 0,
            'Athletic Ability': 0,
            'Data Analysis': 0,
            'Mental Stamina': 0,
            'Engineering': 0,
            'Scientific Research': 0,
            'Customer Relations': 0,
            'Human Behavior Analysis': 0,
            'Public Relations': 0,
            'Budgeting Skills': 0,
            'Interpersonal Skills': 0,
            'Innovation': 0,
            'Writing': 0,
            'Entrepreneurial Spirit': 0,
            'Social Skills': 0,
            'Environmental Science': 0,
            'Tradition': 0,
            'Risk Taking': 0,
            'Coding': 0,
            'Technical Accuracy': 0,
            'Precision': 0,
            'Persuasion': 0,
            'Market Analysis': 0,
            'Psychology': 0,
            'Artificial Intelligence': 0,
            'Experimental Thinking': 0,
            'Business': 0,
            'Entrepreneurship': 0,
            'Long-term Planning': 0,
            'Compassion': 0,
            'Big Picture Thinking': 0,
            'Visionary Thinking': 0,
            'Visual Skills': 0,
            'Problem Solving': 0
        }
        
        try:
            # Load scoring system
            scoring_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'scoring_system.json')
            if not os.path.exists(scoring_path):
                raise FileNotFoundError(f"Scoring system file not found at {scoring_path}")
                
            with open(scoring_path, 'r') as f:
                self.scoring_system = json.load(f)
            
            # Validate scoring system against trait_scores
            self._validate_scoring_system()
            
        except Exception as e:
            logging.error(f"Failed to initialize AssessmentManager: {str(e)}")
            raise

    def _validate_scoring_system(self):
        """Validate that all traits in scoring system exist in trait_scores."""
        missing_traits = set()
        
        for question, choices in self.scoring_system.items():
            for choice, traits in choices.items():
                for trait in traits:
                    if trait not in self.trait_scores:
                        missing_traits.add(trait)
        
        if missing_traits:
            logging.error(f"Found undefined traits in scoring system: {missing_traits}")
            raise ValueError(f"Scoring system contains undefined traits: {missing_traits}")

    def calculate_scores(self, answers: Dict[str, Union[str, List[str]]]) -> Dict[str, float]:
        """Calculate trait scores based on questionnaire answers."""
        try:
            # Reset scores
            for trait in self.trait_scores:
                self.trait_scores[trait] = 0
                
            # Process each answer
            for question_id, answer in answers.items():
                # Skip questions that aren't meant for scoring
                if question_id in ['question27', 'question30', 'question32', 'question46', 
                                 'question47', 'question48', 'question49', 'question50']:
                    continue
                    
                if question_id not in self.scoring_system:
                    continue
                    
                # Handle multiple choice answers
                if isinstance(answer, list):
                    for choice in answer:
                        if choice in self.scoring_system[question_id]:
                            self._add_trait_scores(self.scoring_system[question_id][choice])
                # Handle single choice answers
                elif answer in self.scoring_system[question_id]:
                    self._add_trait_scores(self.scoring_system[question_id][answer])
            
            # Normalize scores
            return self._normalize_scores()
            
        except Exception as e:
            logging.error(f"Score calculation failed: {str(e)}")
            raise

    def _add_trait_scores(self, trait_values: Dict[str, int]):
        """Add trait scores from a single answer choice."""
        for trait, value in trait_values.items():
            if trait in self.trait_scores:
                self.trait_scores[trait] += value
            else:
                logging.warning(f"Ignoring unknown trait: {trait}")

    def _normalize_scores(self) -> Dict[str, float]:
        """Normalize trait scores to 0-100 range."""
        max_possible = {trait: 0 for trait in self.trait_scores}
        
        # Calculate maximum possible score for each trait
        for question in self.scoring_system.values():
            for choice in question.values():
                for trait, value in choice.items():
                    if trait in max_possible:
                        max_possible[trait] = max(max_possible[trait], value)
        
        # Normalize scores
        normalized = {}
        for trait, score in self.trait_scores.items():
            if max_possible[trait] > 0:
                normalized[trait] = round((score / max_possible[trait]) * 100, 2)
            else:
                normalized[trait] = 0.0
                
        return normalized

    def get_career_prediction_prompt(self, trait_scores: Dict[str, float], student_info: Dict) -> str:
        """Generate prompt for career prediction based on trait scores."""
        return f"""Based on the following comprehensive assessment of {student_info.get('name', 'the student')}:

Trait Scores Analysis:
{json.dumps(trait_scores, indent=2)}

Student Profile:
- Age: {student_info.get('age', 'Not provided')}
- Academic Background: {student_info.get('academic_info', 'Not provided')}
- Interests: {student_info.get('interests', 'Not provided')}
- Notable Achievements: {student_info.get('achievements', 'Not provided')}

Please provide a detailed career analysis including:
1. Top 5 recommended career paths based on the trait scores
2. Required skills and development roadmap for each career
3. Educational requirements and recommended certifications
4. Industry growth prospects and future outlook
5. Potential challenges and strategies to overcome them

Format the response in clear sections with detailed explanations for each recommendation."""