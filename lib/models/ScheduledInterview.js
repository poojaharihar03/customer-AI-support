import mongoose from 'mongoose';

const PrepTaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const ScheduledInterviewSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  interviewType: {
    type: String,
    enum: ['phone', 'technical', 'behavioral', 'system-design', 'onsite', 'hr'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  prepTasks: [PrepTaskSchema],
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ScheduledInterview || mongoose.model('ScheduledInterview', ScheduledInterviewSchema);
