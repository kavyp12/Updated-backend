// src/models/Marks.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMarks extends Document {
  userId: mongoose.Types.ObjectId;
  subjects: {
    subjectName: string;
    marks: number;
    totalMarks: number;
  }[];
  createdAt: Date;
}

const MarksSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjects: [{
    subjectName: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IMarks>('Marks', MarksSchema);