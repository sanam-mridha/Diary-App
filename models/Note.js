const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isSecret: { type: Boolean, default: false },
  encryptedContent: { type: String }, 
  passwordHash: { type: String },     
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
