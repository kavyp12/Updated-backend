"use strict";
// // E:\career-guide\backend\src\routes\questionnaireRoutes.ts
// import express, { Request, Response, NextFunction } from 'express';
// import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
// import Questionnaire from '../models/QuestionnaireModel';
// import User from '../models/User';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Helper function to handle async routes
// const asyncHandler = (fn: (req: Request | AuthRequest, res: Response, next: NextFunction) => Promise<any>) => 
//   (req: Request | AuthRequest, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// router.post('/submit-answers', verifyToken, asyncHandler(async (req: AuthRequest, res: Response) => {
//   try {
//     // Ensure user is authenticated
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     // Find the full user details
//     const user = await User.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Check if user already submitted questionnaire
//     const existingQuestionnaire = await Questionnaire.findOne({ userId: user._id });
//     if (existingQuestionnaire) {
//       return res.status(400).json({ message: 'Questionnaire already submitted' });
//     }
//     // Transform answers into the desired format
//     const transformedAnswers = req.body.answers.reduce((acc: any, curr: any) => {
//       acc[`question${curr.questionId}`] = curr.answer;
//       return acc;
//     }, {});
//     // Create new questionnaire submission
//     const newQuestionnaire = new Questionnaire({
//       userId: user._id,
//       studentName: `${user.firstName} ${user.lastName}`,
//       age: user.age || '', // Add age if available in user profile
//       academicInfo: `${user.standard} Grade`, // Using standard as academic info
//       interests: user.interests || '', // Add interests if available
//       answers: transformedAnswers
//     });
//     // Save questionnaire
//     await newQuestionnaire.save();
//     res.status(201).json({ 
//       message: 'Questionnaire submitted successfully',
//       questionnaireId: newQuestionnaire._id 
//     });
//   } catch (error) {
//     console.error('Questionnaire submission error:', error);
//     res.status(500).json({ message: 'Failed to submit questionnaire' });
//   }
// }));
// // Route to get user's questionnaire
// router.get('/get-answers', verifyToken, asyncHandler(async (req: AuthRequest, res: Response) => {
//   try {
//     // Ensure user is authenticated
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const questionnaire = await Questionnaire.findOne({ userId: req.user.userId });
//     if (!questionnaire) {
//       return res.status(404).json({ message: 'No questionnaire found' });
//     }
//     res.status(200).json(questionnaire);
//   } catch (error) {
//     console.error('Error fetching questionnaire:', error);
//     res.status(500).json({ message: 'Failed to fetch questionnaire' });
//   }
// }));
// export default router;
// import express, { Request, Response, NextFunction } from 'express';
// import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
// import Questionnaire from '../models/QuestionnaireModel';
// import User from '../models/User';
// import axios from 'axios';
// const router = express.Router();
// // Helper function to handle async routes
// const asyncHandler = (fn: (req: Request | AuthRequest, res: Response, next: NextFunction) => Promise<any>) => 
//   (req: Request | AuthRequest, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// router.post('/submit-answers', verifyToken, asyncHandler(async (req: AuthRequest, res: Response) => {
//   try {
//     // Ensure user is authenticated
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     // Find the full user details
//     const user = await User.findById(req.user.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     // Check if user already submitted questionnaire
//     const existingQuestionnaire = await Questionnaire.findOne({ userId: user._id });
//     if (existingQuestionnaire) {
//       return res.status(400).json({ message: 'Questionnaire already submitted' });
//     }
//     // Transform answers into the desired format
//     const transformedAnswers = req.body.answers.reduce((acc: any, curr: any) => {
//       acc[`question${curr.questionId}`] = curr.answer;
//       return acc;
//     }, {});
//     // Create new questionnaire submission
//     const newQuestionnaire = new Questionnaire({
//       userId: user._id,
//       studentName: `${user.firstName} ${user.lastName}`,
//       age: user.age || '',
//       academicInfo: `${user.standard} Grade`,
//       interests: user.interests || '',
//       answers: transformedAnswers
//     });
//     // Save questionnaire
//     await newQuestionnaire.save();
//     // Format data for AI service
//     const aiServiceData = {
//       studentName: newQuestionnaire.studentName,
//       age: newQuestionnaire.age,
//       academicInfo: newQuestionnaire.academicInfo,
//       sportsInterests: newQuestionnaire.interests,
//       answers: transformedAnswers
//     };
//     try {
//       // Send data to AI service
//       const aiResponse = await axios.post('https://p.enhc.tech/api/submit-assessment', aiServiceData);
//       // Return combined response
//       res.status(201).json({ 
//         message: 'Questionnaire submitted successfully',
//         questionnaireId: newQuestionnaire._id,
//         aiResponse: aiResponse.data
//       });
//     } catch (aiError) {
//       console.error('AI service error:', aiError);
//       // Still return success for questionnaire submission even if AI service fails
//       res.status(201).json({ 
//         message: 'Questionnaire submitted successfully, but AI processing failed',
//         questionnaireId: newQuestionnaire._id,
//         aiError: 'Failed to process with AI service'
//       });
//     }
//   } catch (error) {
//     console.error('Questionnaire submission error:', error);
//     res.status(500).json({ message: 'Failed to submit questionnaire' });
//   }
// }));
// // Route to get user's questionnaire and process with AI
// router.get('/process-questionnaire/:id', verifyToken, asyncHandler(async (req: AuthRequest, res: Response) => {
//   try {
//     const questionnaire = await Questionnaire.findById(req.params.id);
//     if (!questionnaire) {
//       return res.status(404).json({ message: 'Questionnaire not found' });
//     }
//     // Format data for AI service
//     const aiServiceData = {
//       studentName: questionnaire.studentName,
//       age: questionnaire.age,
//       academicInfo: questionnaire.academicInfo,
//       sportsInterests: questionnaire.interests,
//       answers: questionnaire.answers
//     };
//     // Send to AI service
//     const aiResponse = await axios.post('https://p.enhc.tech/api/submit-assessment', aiServiceData);
//     res.status(200).json({
//       questionnaire,
//       aiResponse: aiResponse.data
//     });
//   } catch (error) {
//     console.error('Error processing questionnaire:', error);
//     res.status(500).json({ message: 'Failed to process questionnaire' });
//   }
// }));
// // Existing get-answers route remains the same
// router.get('/get-answers', verifyToken, asyncHandler(async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const questionnaire = await Questionnaire.findOne({ userId: req.user.userId });
//     if (!questionnaire) {
//       return res.status(404).json({ message: 'No questionnaire found' });
//     }
//     res.status(200).json(questionnaire);
//   } catch (error) {
//     console.error('Error fetching questionnaire:', error);
//     res.status(500).json({ message: 'Failed to fetch questionnaire' });
//   }
// }));
// export default router;
// E:\career-guide\backend\src\routes\questionnaireRoutes.ts
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const QuestionnaireModel_1 = __importDefault(require("../models/QuestionnaireModel"));
const User_1 = __importDefault(require("../models/User"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
// Helper function for async route handling
const asyncHandler = (fn) => (req, res) => {
    Promise.resolve(fn(req, res)).catch((error) => {
        console.error('Route error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    });
};
// Submit answers route
router.post('/submit-answers', authMiddleware_1.verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }
    try {
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check for existing questionnaire
        const existingQuestionnaire = await QuestionnaireModel_1.default.findOne({ userId });
        if (existingQuestionnaire) {
            return res.status(400).json({ message: 'Questionnaire already submitted' });
        }
        // Update user status to Analyzing
        await User_1.default.findByIdAndUpdate(userId, { status: 'Analyzing' });
        // Transform answers for AI service
        const transformedAnswers = req.body.answers.reduce((acc, curr) => {
            acc[`question${curr.questionId}`] = curr.answer;
            return acc;
        }, {});
        // Create new questionnaire
        const newQuestionnaire = new QuestionnaireModel_1.default({
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
            const aiResponse = await axios_1.default.post('https://p.enhc.tech/api/submit-assessment', aiServiceData);
            if (aiResponse.data.report_url) {
                // Extract filename from URL
                const reportPath = aiResponse.data.report_url.split('/').pop();
                // Update user with report info
                await User_1.default.findByIdAndUpdate(userId, {
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
        }
        catch (aiError) {
            console.error('AI service error:', aiError);
            // Update user status to error
            await User_1.default.findByIdAndUpdate(userId, { status: 'Error' });
            return res.status(500).json({
                message: 'Failed to process with AI service',
                error: aiError instanceof Error ? aiError.message : 'Unknown error'
            });
        }
    }
    catch (error) {
        console.error('Questionnaire submission error:', error);
        // Update user status to error
        await User_1.default.findByIdAndUpdate(userId, { status: 'Error' });
        return res.status(500).json({
            message: 'Failed to submit questionnaire',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Get report status route
router.get('/report-status', authMiddleware_1.verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            status: user.status || 'Pending',
            reportPath: user.reportPath || null
        });
    }
    catch (error) {
        console.error('Status fetch error:', error);
        return res.status(500).json({
            message: 'Failed to fetch report status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Get answers route
router.get('/get-answers', authMiddleware_1.verifyToken, asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }
    try {
        const questionnaire = await QuestionnaireModel_1.default.findOne({ userId });
        if (!questionnaire) {
            return res.status(404).json({ message: 'No questionnaire found for this user' });
        }
        return res.status(200).json(questionnaire);
    }
    catch (error) {
        console.error('Questionnaire fetch error:', error);
        return res.status(500).json({
            message: 'Failed to fetch questionnaire',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
exports.default = router;
