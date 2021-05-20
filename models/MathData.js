const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  riskMatrix: String,
  benefitMatrix: String,
  probabilities: String,
  solutions: String,
});

module.exports = model('MathData', schema);
