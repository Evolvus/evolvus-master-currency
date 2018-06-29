const debug = require("debug")("evolvus-master-currency.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const masterCurrency = require("../index");
const db = require("../db/masterCurrency");

describe('masterCurrency model validation', () => {
  let masterCurrencyObject = {
    // add a valid masterCurrency Object here
    "tenantId": "tenIdmasteCurr",
    "currencyCode": "de894",
    "currencyName": "RUPEESIndia",
    "decimalDigit": "4",
    "delimiter": "8",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "objVersion": 123,
    "enabledFlag": "1",
    "currencyLocale": "BANGALORE"
  };

  let invalidObject = {
    //add invalid masterCurrency Object here

    "currencyCode": "master12",
    "currencyName": "123RUPEES",
    "decimalDigit": 4125,
    "delimiter": "89"
  };

  let undefinedObject; // object that is not defined
  let nullObject = null; // object that is null

  // before we start the tests, connect to the database
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("validation against jsonschema", () => {
    it("valid masterCurrency should validate successfully", (done) => {
      try {
        var res = masterCurrency.validate(masterCurrencyObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid masterCurrency object should not throw exception: ${e}`);
      }
    });

    it("invalid masterCurrency should return errors", (done) => {
      try {
        var res = masterCurrency.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = masterCurrency.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = masterCurrency.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });

  describe("testing masterCurrency.save method", () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should save a valid masterCurrency object to database', (done) => {
      try {
        var result = masterCurrency.save(masterCurrencyObject);
        //replace anyAttribute with one of the valid attribute of a masterCurrency Object
        expect(result)
          .to.eventually.have.property("currencyName")
          .to.eql(masterCurrencyObject.currencyName)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving masterCurrency object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid masterCurrency object to database', (done) => {
      try {
        var result = masterCurrency.save(invalidObject);
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing masterCurrency.getAll when there is data in database', () => {
    let object1 = {
        //add one valid masterCurrency object here
        "tenantId": "object1",
        "currencyCode": "onemo",
        "currencyName": "RUPEESone",
        "decimalDigit": "1",
        "delimiter": "9",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      },
      object2 = {
        //add one more valid masterCurrency object here
        "tenantId": "objtwo",
        "currencyCode": "terob",
        "currencyName": "RUPEEStwo",
        "decimalDigit": "2",
        "delimiter": "7",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      };

    object3 = {
      //add one more valid masterCurrency object here
      "tenantId": "objthree",
      "currencyCode": "robjt",
      "currencyName": "RUPEESthree",
      "decimalDigit": "3",
      "delimiter": "6",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "objVersion": 123,
      "enabledFlag": "1",
      "currencyLocale": "BANGALORE"
    };


    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            db.save(object3).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return limited records as specified by the limit parameter', (done) => {
      try {
        let res = masterCurrency.getAll(2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(2);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return all records if limit is -1', (done) => {
      try {
        let res = masterCurrency.getAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(3);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw IllegalArgumentException for null value of limit', (done) => {
      try {
        let res = masterCurrency.getAll(null);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw IllegalArgumentException for undefined value of limit', (done) => {
      try {
        let undefinedLimit;
        let res = masterCurrency.getAll(undefinedLimit);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing masterCurrency.getAll when there is no data', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should return empty array when limit is -1', (done) => {
      try {
        let res = masterCurrency.getAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty array when limit is positive value ', (done) => {
      try {
        let res = masterCurrency.getAll(2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe('testing getById', () => {
    // Insert one record , get its id
    // 1. Query by this id and it should return one masterCurrency object
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    var id;
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(masterCurrencyObject).then((res) => {
          id = res._id;
          done();
        });
      });
    });

    it('should return one masterCurrency matching parameter id', (done) => {
      try {
        var res = masterCurrency.getById(id);
        expect(res).to.eventually.have.property('_id')
          .to.eql(id)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty object i.e. {} as no masterCurrency is identified by this Id ', (done) => {
      try {
        let badId = new mongoose.mongo.ObjectId();
        var res = masterCurrency.getById(badId);
        expect(res).to.eventually.to.eql({})
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
      try {
        let undefinedId;
        let res = masterCurrency.getById(undefinedId);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null Id parameter ", (done) => {
      try {
        let res = masterCurrency.getById(null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should be rejected for arbitrary object as Id parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value
      let id = masterCurrencyObject;
      let res = masterCurrency.getById(id);
      expect(res)
        .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
        .notify(done);
    });

  });

  describe("testing masterCurrency.getOne", () => {
    let object1 = {
        //add one valid masterCurrency object here
        "tenantId": "tenIdmasteobjo",
        "currencyCode": "moneyobjo",
        "currencyName": "RUPEESIndiaobjo",
        "decimalDigit": "4",
        "delimiter": "8",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      },
      object2 = {
        //add one more valid masterCurrency object here
        "tenantId": "tenIdmasteobjt",
        "currencyCode": "moneyobjt",
        "currencyName": "RUPEESIndiaobjt",
        "decimalDigit": "4",
        "delimiter": "8",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      };
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it("should return one masterCurrency record identified by attribute", (done) => {
      try {
        // take one attribute from object1 or object2 and its value
        let res = masterCurrency.getOne(`currencyCode`, `moneyobjt`);
        expect(res)
          .to.eventually.be.a("object")
          .to.have.property(`currencyCode`)
          .to.eql(`moneyobjt`)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty object i.e. {} as no masterCurrency is identified by this attribute', (done) => {
      try {
        // replace validAttribute and add a bad value to it
        var res = masterCurrency.getOne(`currencyCode`, `cur`);
        expect(res).to.eventually.to.eql({})
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        //replace validvalue with a valid value for an attribute
        let undefinedAttribute;
        let res = masterCurrency.getOne(undefinedAttribute, `moneyobjt`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        // replace validAttribute with a valid attribute name
        let undefinedValue;
        let res = masterCurrency.getOne(`currencyCode`, undefinedValue);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
      try {
        //replace validValue with a valid value for an attribute
        let res = masterCurrency.getOne(null, `moneyobjt`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null value parameter ", (done) => {
      try {
        //replace attributeValue with a valid attribute name
        let res = masterCurrency.getOne(`currencyCode`, null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });


  describe("testing masterCurrency.getMany", () => {
    let object1 = {
        //add one valid masterCurrency object here
        "tenantId": "tenIdmasteobjt1",
        "currencyCode": "moneyobjt1",
        "currencyName": "RUPEESIndiaobjt1",
        "decimalDigit": "4",
        "delimiter": "8",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      },
      object2 = {
        //add one more valid masterCurrency object here
        "tenantId": "tenIdmasteobjt2",
        "currencyCode": "moneyobjt2",
        "currencyName": "RUPEESIndiaobjt2",
        "decimalDigit": "4",
        "delimiter": "8",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      };
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it("should return array of masterCurrency records identified by attribute", (done) => {
      try {
        // take one attribute from object1 or object2 and its value
        let res = masterCurrency.getMany(`currencyCode`, `moneyobjt2`);
        expect(res).to.eventually.be.a("array");
        //enter proper length according to input value
        expect(res).to.eventually.have.length(1);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty array i.e. [] as no masterCurrency is identified by this attribute', (done) => {
      try {
        // replace validAttribute and add a bad value to it
        var res = masterCurrency.getMany(`currencyCode`, `cu`);
        expect(res).to.eventually.to.eql([])
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        //replace validvalue with a valid value for an attribute
        let undefinedAttribute;
        let res = masterCurrency.getMany(undefinedAttribute, `moneyobjt2`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        // replace validAttribute with a valid attribute name
        let undefinedValue;
        let res = masterCurrency.getMany(`currencyCode`, undefinedValue);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
      try {
        //replace validValue with a valid value for an attribute
        let res = masterCurrency.getMany(null, `moneyobjt2`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null value parameter ", (done) => {
      try {
        //replace attributeValue with a valid attribute name
        let res = masterCurrency.getMany(`currencyCode`, null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });
});