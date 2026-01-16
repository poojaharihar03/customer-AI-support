import mongoose from 'mongoose';

const SkillScoreSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const FeedbackEntrySchema = new mongoose.Schema({
  question: String,
  response: String,
  scores: {
    clarity: Number,
    relevance: Number,
    depth: Number,
    examples: Number,
    communication: Number
  },
  overallScore: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProgressSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalPracticeTime: {
    type: Number, // in minutes
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  lastPracticeDate: {
    type: Date,
    default: null
  },
  skillScores: [SkillScoreSchema],
  monthlyScores: [{
    month: String,
    year: Number,
    behavioral: Number,
    technical: Number,
    systemDesign: Number
  }],
  feedbackHistory: [FeedbackEntrySchema],
  strengths: [{
    area: String,
    score: Number,
    trend: {
      type: String,
      enum: ['improving', 'stable', 'declining'],
      default: 'stable'
    }
  }],
  weaknesses: [{
    area: String,
    score: Number,
    trend: {
      type: String,
      enum: ['improving', 'stable', 'declining'],
      default: 'stable'
    }
  }],
  companyPrepProgress: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProgressSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
