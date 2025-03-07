"use strict";
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/authRoutes'; // Ensure this import is correct
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Load environment variables
// dotenv.config();
// const app = express();
// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI!)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));
// // Middleware
// app.use(cors());
// app.use(express.json()); // Ensure this is used to parse JSON bodies
// // Routes
// app.use('/api/auth', authRoutes); // Ensure this is correctly mounted
// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// E:\career-guide\backend\src\server.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const questionnaireRoutes_1 = __importDefault(require("./routes/questionnaireRoutes"));
const marksRoutes_1 = __importDefault(require("./routes/marksRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', marksRoutes_1.default);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/questionnaire', questionnaireRoutes_1.default);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
