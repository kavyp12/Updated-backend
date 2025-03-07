import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import Questionnaire from '../models/QuestionnaireModel';
import User from '../models/User';
import axios from 'axios';

// Define interface for the extended request with user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

const router = express.Router();

// Helper function for async route handling
const asyncHandler = (fn: Function) => (req: Request, res: Response) => {
  Promise.resolve(fn(req, res)).catch((error) => {
    console.error('Route error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  });
};

// Submit answers route
router.post('/submit-answers', verifyToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }

  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing questionnaire
    const existingQuestionnaire = await Questionnaire.findOne({ userId });
    if (existingQuestionnaire) {
      return res.status(400).json({ message: 'Questionnaire already submitted' });
    }

    // Update user status to Analyzing
    await User.findByIdAndUpdate(userId, { status: 'Analyzing' });

    // Transform answers for AI service
    const transformedAnswers = req.body.answers.reduce((acc: Record<string, any>, curr: any) => {
      acc[`question${curr.questionId}`] = curr.answer;
      return acc;
    }, {});

    // Create new questionnaire
    const newQuestionnaire = new Questionnaire({
      userId: userId,
      studentName: `${user.firstName} ${user.lastName}`,
      age: user.age || '',
      academicInfo: `${user.standard} Grade`,
      interests: user.interests || '',
      answers: transformedAnswers
    });

    await newQuestionnaire.save();

    // Prepare data for AI service
    const aiServiceData = {
      studentName: newQuestionnaire.studentName,
      age: newQuestionnaire.age,
      academicInfo: newQuestionnaire.academicInfo,
      interests: newQuestionnaire.interests,
      answers: transformedAnswers
    };

    try {
      // Send to AI service
      const aiResponse = await axios.post('https://p.enhc.tech/api/submit-assessment', aiServiceData);
      
      if (aiResponse.data.report_url) {
        // Extract filename from URL
        const reportPath = aiResponse.data.report_url.split('/').pop();
        
        // Update user with report info
        await User.findByIdAndUpdate(userId, {
          status: 'Report Generated',
          reportPath: reportPath
        });

        return res.status(201).json({ 
          message: 'Questionnaire submitted and report generated successfully',
          reportUrl: aiResponse.data.report_url
        });
      }

      // If no report URL in response
      throw new Error('No report URL received from AI service');

    } catch (aiError) {
      console.error('AI service error:', aiError);
      
      // Update user status to error
      await User.findByIdAndUpdate(userId, { status: 'Error' });
      
      return res.status(500).json({ 
        message: 'Failed to process with AI service',
        error: aiError instanceof Error ? aiError.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Questionnaire submission error:', error);
    
    // Update user status to error
    await User.findByIdAndUpdate(userId, { status: 'Error' });
    
    return res.status(500).json({ 
      message: 'Failed to submit questionnaire',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get report status route
router.get('/report-status', verifyToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: user.status || 'Pending',
      reportPath: user.reportPath || null
    });

  } catch (error) {
    console.error('Status fetch error:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch report status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Get answers route
router.get('/get-answers', verifyToken, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }

  try {
    const questionnaire = await Questionnaire.findOne({ userId });
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'No questionnaire found for this user' });
    }

    return res.status(200).json(questionnaire);

  } catch (error) {
    console.error('Questionnaire fetch error:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch questionnaire',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

export default router;