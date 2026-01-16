import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const InterviewSessionSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  roundType: {
    type: String,
    enum: ['behavioral', 'technical', 'systemDesign'],
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answeredQuestions: {
    type: Number,
    default: 0
  },
  timeUsed: {
    type: Number, // in seconds
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  averageTimePerQuestion: {
    type: Number,
    default: 0
  },
  answers: [AnswerSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.InterviewSession || mongoose.model('InterviewSession', InterviewSessionSchema);
