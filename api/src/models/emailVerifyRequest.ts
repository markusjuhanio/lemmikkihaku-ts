import mongoose from 'mongoose';

const emailVerifyRequestSchema = new mongoose.Schema({
  guid: String,
  email: String,
  validTo: Date,
  status: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

emailVerifyRequestSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('EmailVerifyRequest', emailVerifyRequestSchema);