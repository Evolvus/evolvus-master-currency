/*
 ** JSON Schema representation of the masterCurrency model
 */
module.exports.schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "masterCurrencyModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64
    },
    "currencyCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 5,
      "unique": true
    },
    "currencyName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,

    },
    "decimalDigit": {
      "type": "string"

    },
    "delimiter": {
      "type": "string"
    },
    "createdDate": {
      "type": "string",
      "format": "date-time"
    },
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time"
    },
    "createdBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "updatedBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "objVersion": {
      "type": "number"
    },
    "enabledFlag": {
      "type": "string",
      "enum": ["0", "1"]
    },
    "currencyLocale": {
      "type": "string"

    }
  },
  "required": ["tenantId", "currencyCode", "currencyName"]
};