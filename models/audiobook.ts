import { Schema, model, models } from 'mongoose';

const AudiobookSchema = new Schema({
  // creator: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  // },
  // title: {
  //   type: String,
  //   required: [true, 'Title is required.'],
  // },
  text: {
    type: String,
    required: [true, 'Text is required.'],
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio url is required.'],
  },
  voiceType: {
    type: String,
    required: [true, 'Voice type is required.'],
  },
  filepath: {
    type: String,
    required: [true, 'Filepath is required.'],
  },
});

const Audiobook = models.Audiobook || model('Audiobook', AudiobookSchema);

export default Audiobook;