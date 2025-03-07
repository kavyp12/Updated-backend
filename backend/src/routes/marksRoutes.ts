// src/routes/marksRoutes.ts
import express from 'express';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';
import Marks from '../models/Marks';
import { Response } from 'express';

const router = express.Router();

router.post('/marks', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjects } = req.body;
    
    if (!req.user?.userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Create new marks entry
    const marksEntry = new Marks({
      userId: req.user.userId, // Using userId from the middleware structure
      subjects: subjects
    });

    // Save to database
    await marksEntry.save();

    res.status(201).json({ message: 'Marks saved successfully' });
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({ error: 'Failed to save marks' });
  }
});

export default router;