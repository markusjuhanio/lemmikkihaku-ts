import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  messages: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      message: {
        iv: String,
        content: String,
      },
      image: {
        name: String,
        url: String,
      },
      deletedBy: [
        {
          type: String,
          default: [],
        },
      ],
      date: Date
    },
  ],
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  deletedBy: [
    {
      type: String,
      default: [],
    },
  ]
}, { timestamps: true });

conversationSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model('Conversation', conversationSchema);