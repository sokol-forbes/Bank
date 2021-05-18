const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  title: String,
  usersCount: Number,
  percent: Number,
  description: String,
});

module.exports = model('Mortgage', schema);