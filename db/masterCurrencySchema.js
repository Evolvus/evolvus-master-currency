const mongoose = require("mongoose");
const validator = require("validator");


var masterCurrencySchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  currencyCode: {
    type: String,
    minLength: 1,
    maxLength: 5,
    unique: true,
    required: true
  },
  currencyName: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true

  },
  decimalDigit: {
    type: String

  },
  delimiter: {
    type: String
  },
  createdDate: {
    type: String,
    format: Date
  },
  lastUpdatedDate: {
    type: String,
    format: Date
  },
  createdBy: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  updatedBy: {
    type: String,
    minLength: 1,
    maxLength: 100
  },
  objVersion: {
    type: Number
  },
  enabledFlag: {
    type: String,
    enum: ["0", "1"]
  },
  currencyLocale: {
    type: String

  }

});

module.exports = masterCurrencySchema;