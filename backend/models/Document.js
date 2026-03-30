const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  tags: {
    type: [String],
    default: []
  },

  filePath: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /* 🔥 Permissions (who can access) */
  permissions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      access: {
        type: String,
        enum: ['viewer', 'editor'],
        default: 'viewer'
      }
    }
  ],

  /* 🔥 Version control */
  versions: [
    {
      filePath: {
        type: String
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  /* 🔥 Share link token */
  shareToken: {
    type: String,
    default: null
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);