import pkg from 'mongoose';
const { Schema, model } = pkg;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  last_name: String,
  first_name: String
});

export default model('User', userSchema);