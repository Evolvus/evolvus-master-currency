const debug = require("debug")("evolvus-master-currency:index");
const masterCurrencySchema = require("./model/masterCurrencySchema")
  .schema;
const masterCurrencyCollection = require("./db/masterCurrency");
const validate = require("jsonschema")
  .validate;
const docketClient = require("evolvus-docket-client");
const masterCurrencyDBSchema = require('./db/masterCurrencySchema');

var docketObject = {
  // required fields
  application: "PLATFORM",
  source: "masterCurrency",
  name: "",
  createdBy: "",
  ipAddress: "",
  status: "SUCCESS", //by default
  eventDateTime: Date.now(),
  keyDataAsJSON: "",
  details: "",
  //non required fields
  level: ""
};

module.exports.masterCurrency = {
  masterCurrencySchema,
  masterCurrencyDBSchema
};

module.exports.validate = (masterCurrencyObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterCurrencyObject === "undefined") {
        throw new Error("IllegalArgumentException:masterCurrencyObject is undefined");
      }
      var res = validate(masterCurrencyObject, masterCurrencySchema);
      debug("validation status: ", JSON.stringify(res));
      if (res.valid) {
        resolve(res.valid);
      } else {
        reject(res.errors);
      }
    } catch (err) {
      reject(err);
    }
  });
};

// All validations must be performed before we save the object here
// Once the db layer is called its is assumed the object is valid.
module.exports.save = (masterCurrencyObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterCurrencyObject === 'undefined' || masterCurrencyObject == null) {
        throw new Error("IllegalArgumentException: masterCurrencyObject is null or undefined");
      }
      docketObject.name = "masterCurrency_save";
      docketObject.keyDataAsJSON = JSON.stringify(masterCurrencyObject);
      docketObject.details = `masterCurrency creation initiated`;
      docketClient.postToDocket(docketObject);
      var res = validate(masterCurrencyObject, masterCurrencySchema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      }

      // Other validations here


      // if the object is valid, save the object to the database
      masterCurrencyCollection.save(masterCurrencyObject).then((result) => {
        debug(`saved successfully ${result}`);
        resolve(result);
      }).catch((e) => {
        debug(`failed to save with an error: ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "masterCurrency_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(masterCurrencyObject);
      docketObject.details = `caught Exception on masterCurrency_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

// List all the objects in the database
// makes sense to return on a limited number
// (what if there are 1000000 records in the collection)
module.exports.getAll = (limit) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof(limit) == "undefined" || limit == null) {
        throw new Error("IllegalArgumentException: limit is null or undefined");
      }
      docketObject.name = "masterCurrency_getAll";
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `masterCurrency getAll method`;
      docketClient.postToDocket(docketObject);

      masterCurrencyCollection.findAll(limit).then((docs) => {
        debug(`masterCurrency(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the master-currency(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "masterCurrency_ExceptionOngetAll";
      docketObject.keyDataAsJSON = "masterCurrencyObject";
      docketObject.details = `caught Exception on masterCurrency_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};


// Get the entity idenfied by the id parameter
module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    try {

      if (typeof(id) == "undefined" || id == null) {
        throw new Error("IllegalArgumentException: id is null or undefined");
      }
      docketObject.name = "masterCurrency_getById";
      docketObject.keyDataAsJSON = `masterCurrencyObject id is ${id}`;
      docketObject.details = `masterCurrency getById initiated`;
      docketClient.postToDocket(docketObject);

      masterCurrencyCollection.findById(id)
        .then((res) => {
          if (res) {
            debug(`masterCurrency found by id ${id} is ${res}`);
            resolve(res);
          } else {
            // return empty object in place of null
            debug(`no masterCurrency found by this id ${id}`);
            resolve({});
          }
        }).catch((e) => {
          debug(`failed to find masterCurrency ${e}`);
          reject(e);
        });

    } catch (e) {
      docketObject.name = "masterCurrency_ExceptionOngetById";
      docketObject.keyDataAsJSON = `masterCurrencyObject id is ${id}`;
      docketObject.details = `caught Exception on masterCurrency_getById ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "masterCurrency_getOne";
      docketObject.keyDataAsJSON = `masterCurrencyObject ${attribute} with value ${value}`;
      docketObject.details = `masterCurrency getOne initiated`;
      docketClient.postToDocket(docketObject);
      masterCurrencyCollection.findOne(attribute, value).then((data) => {
        if (data) {
          debug(`masterCurrency found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no masterCurrency found by this ${attribute} ${value}`);
          resolve({});
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "masterCurrency_ExceptionOngetOne";
      docketObject.keyDataAsJSON = `masterCurrencyObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on masterCurrency_getOne ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getMany = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "masterCurrency_getMany";
      docketObject.keyDataAsJSON = `masterCurrencyObject ${attribute} with value ${value}`;
      docketObject.details = `masterCurrency getMany initiated`;
      docketClient.postToDocket(docketObject);
      masterCurrencyCollection.findMany(attribute, value).then((data) => {
        if (data) {
          debug(`masterCurrency found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no masterCurrency found by this ${attribute} ${value}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "masterCurrency_ExceptionOngetMany";
      docketObject.keyDataAsJSON = `masterCurrencyObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on masterCurrency_getMany ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};