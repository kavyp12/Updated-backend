"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/marksRoutes.ts
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const Marks_1 = __importDefault(require("../models/Marks"));
const router = express_1.default.Router();
router.post('/marks', authMiddleware_1.verifyToken, async (req, res) => {
    try {
        const { subjects } = req.body;
        if (!req.user?.userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        // Create new marks entry
        const marksEntry = new Marks_1.default({
            userId: req.user.userId, // Using userId from the middleware structure
            subjects: subjects
        });
        // Save to database
        await marksEntry.save();
        res.status(201).json({ message: 'Marks saved successfully' });
    }
    catch (error) {
        console.error('Error saving marks:', error);
        res.status(500).json({ error: 'Failed to save marks' });
    }
});
exports.default = router;
