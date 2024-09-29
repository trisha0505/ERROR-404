// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
