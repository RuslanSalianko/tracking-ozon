import pkg from 'mongoose';

const { Schema, model } = pkg;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastName: String,
  firstName: String,
  clientId: Number,
  apiKey: String,
});

export default model('User', userSchema);
