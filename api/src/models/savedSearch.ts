import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  type: String,
  date: Date,
  userId: String,
  filters: [
    {
      filterValue: String,
      filterType: String
    }
  ]
}, { timestamps: true });

searchSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('SavedSearch', searchSchema);