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

userSchema.methods.saveSettings = function saveSettings(clientId, apiKey) {
  this.clientId = clientId;
  this.apiKey = apiKey;
  return this.save();
};

export default model('User', userSchema);
