// E:\career-guide\backend\src\models\QuestionnaireModel.ts
import mongoose from 'mongoose';

const QuestionnaireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  age: {
    type: String,
    default: ''
  },
  academicInfo: {
    type: String,
    default: ''
  },
  interests: {
    type: String,
    default: ''
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Questionnaire', QuestionnaireSchema);