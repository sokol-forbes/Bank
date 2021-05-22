const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fio: {
    required: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: String,
  isAdmin: Boolean,
  links: [
    {
      mortgageId: String,
      percent: Number,
      alt: Number,
      percents: Number,
      mark: Number,
      risk: Number,
      sum: Number,
      date: Date,
    },
  ],
  gameMethod: Number,
  koef: Number,
});

module.exports = model('User', schema);
