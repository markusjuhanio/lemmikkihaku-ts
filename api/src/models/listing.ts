import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  listingType: {
    type: String,
  },
  category: {
    type: String,
  },
  specie: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  race: {
    type: String
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  fullDescription: {
    type: String,
  },
  price: {
    type: Number
  },
  date: {
    type: Date,
  },
  images: [
    {
      name: {
        type: String
      },
      url: {
        type: String
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  activated: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Number,
    default: 0
  },
  rejected: {
    type: Number,
    default: 0
  },
  registrationNumber: String,
}, { timestamps: true });

listingSchema.index({ '$**': 'text' });

listingSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('Listing', listingSchema);