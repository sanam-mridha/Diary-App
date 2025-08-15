const Note = require('../models/Note');
const { encrypt, decrypt, hashPassword, comparePassword } = require('../utils/encryption');

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, isSecret, password } = req.body;
    let newNoteData = { title, content, isSecret };

    if (isSecret) {
      if (!password) return res.status(400).json({ message: 'Password required for secret note' });
      newNoteData.passwordHash = await hashPassword(password);
      newNoteData.encryptedContent = encrypt(content, password);
      newNoteData.content = ''; 
    }

    const note = await Note.create(newNoteData);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.isSecret) {
      if (!password) return res.status(401).json({ message: 'Password required' });
      const match = await comparePassword(password, note.passwordHash);
      if (!match) return res.status(403).json({ message: 'Incorrect password' });

      const decryptedContent = decrypt(note.encryptedContent, password);
      return res.json({ ...note._doc, content: decryptedContent });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, isSecret, password } = req.body;

    let updateData = { title, content, isSecret };

    if (isSecret) {
      if (!password) return res.status(400).json({ message: 'Password required for secret note' });
      updateData.passwordHash = await hashPassword(password);
      updateData.encryptedContent = encrypt(content, password);
      updateData.content = '';
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedNote);
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    next(err);
  }
};
