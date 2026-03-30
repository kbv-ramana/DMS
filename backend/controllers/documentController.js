const Document = require('../models/Document');
const User = require('../models/User');
const crypto = require('crypto');

/* ✅ Upload Document */
const uploadDocument = async (req, res) => {
  try {
    const { title, tags } = req.body;

    const document = await Document.create({
      title,
      tags: tags.split(','),
      filePath: req.file.path,
      uploadedBy: req.user.id,
      permissions: [
        {
          user: req.user.id,
          access: 'editor'
        }
      ]
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ✅ My Files */
const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user.id
    });

    res.json(documents);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ✅ Shared With Me */
const getSharedDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: { $ne: req.user.id },
      'permissions.user': req.user.id
    });

    res.json(documents);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 🔍 Search */
const searchDocuments = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const documents = await Document.find({
      $and: [
        {
          $or: [
            { uploadedBy: req.user.id },
            { 'permissions.user': req.user.id }
          ]
        },
        {
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { tags: { $regex: keyword, $options: 'i' } }
          ]
        }
      ]
    });

    res.json(documents);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 🔥 Share Document (Email + Link) */
const shareDocument = async (req, res) => {
  try {
    const { email, access } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    /* 🔍 Find user */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    /* 🚫 Avoid duplicate */
    const alreadyShared = document.permissions.find(
      p => p.user.toString() === user._id.toString()
    );

    if (!alreadyShared) {
      document.permissions.push({
        user: user._id,
        access
      });
    }

    /* 🔥 Generate share link token */
    document.shareToken = crypto.randomBytes(20).toString('hex');

    await document.save();

    res.json({
      message: 'Document shared successfully',
      link: `http://localhost:4200/share/${document.shareToken}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 🔥 Access via Share Link */
const accessSharedDocument = async (req, res) => {
  try {
    const { token, email } = req.body;

    const document = await Document.findOne({ shareToken: token });

    if (!document) {
      return res.status(404).json({ message: 'Invalid link' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowed = document.permissions.find(
      p => p.user.toString() === user._id.toString()
    );

    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(document);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ✏️ Update Document */
const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const hasAccess = document.permissions.find(
      p => p.user.toString() === req.user.id && p.access === 'editor'
    );

    if (!hasAccess) {
      return res.status(403).json({ message: 'No edit permission' });
    }

    document.versions.push({
      filePath: document.filePath
    });

    document.filePath = req.file.path;

    await document.save();

    res.json({
      message: 'Document updated successfully',
      document
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ❌ Delete Document */
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only owner can delete' });
    }

    await document.deleteOne();

    res.json({
      message: 'Document deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getSharedDocuments,
  searchDocuments,
  shareDocument,
  accessSharedDocument,
  updateDocument,
  deleteDocument
};