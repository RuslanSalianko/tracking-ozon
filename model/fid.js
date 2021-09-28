import pkg from 'mongoose';

const { Schema, model } = pkg;

const fidSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  fid: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

export default model('Fid', fidSchema);
