const debug = require("debug")("evolvus-master-currency.test.db.masterCurrency");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const masterCurrency = require("../../db/masterCurrency");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/masterCurrency.js
describe("db masterCurrency testing", () => {
  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  let object1 = {
    // add a valid masterCurrency object
    "tenantId": "tenId1",
    "currencyCode": "cu123",
    "currencyName": "rupee",
    "decimalDigit": "1",
    "delimiter": "9",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "objVersion": 123,
    "enabledFlag": "1",
    "currencyLocale": "Bank"
  };
  let object2 = {
    // add a valid masterCurrency object
    "tenantId": "tenId2",
    "currencyCode": "cuert",
    "currencyName": "money",
    "decimalDigit": "1",
    "delimiter": "6",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "objVersion": 123,
    "enabledFlag": "1",
    "currencyLocale": "BANK"
  };

  describe("testing masterCurrency.save", () => {
    // Testing save
    // 1. Valid masterCurrency should be saved.
    // 2. Non masterCurrency object should not be saved.
    // 3. Should not save same masterCurrency twice.
    beforeEach((done) => {
      masterCurrency.deleteAll()
        .then((data) => {
          done();
        });
    });

    it("should save valid masterCurrency to database", (done) => {
      let testmasterCurrencyCollection = {
        // add a valid masterCurrency object
        "tenantId": "tenIdmaster",
        "currencyCode": "aster",
        "currencyName": "RUPEES",
        "decimalDigit": "8",
        "delimiter": "7",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "objVersion": 123,
        "enabledFlag": "1",
        "currencyLocale": "BANGALORE"
      };
      let res = masterCurrency.save(testmasterCurrencyCollection);
      expect(res)
        .to.eventually.include(testmasterCurrencyCollection)
        .notify(done);
    });

    it("should fail saving invalid object to database", (done) => {
      // not even a  object

      let invalidObject = {
        // add a invalid masterCurrency object

        "currencyCode": "master12",
        "currencyName": "123RUPEES",
        "decimalDigit": 123454,
        "delimiter": "89"
      };
      let res = masterCurrency.save(invalidObject);
      expect(res)
        .to.be.eventually.rejectedWith("masterCurrencyCollection validation failed")
        .notify(done);
    });
  });

  describe("testing masterCurrency.findAll by limit", () => {
    // 1. Delete all records in the table and insert
    //    4 new records.
    // find -should return an array of size equal to value of limit with the
    // roleMenuItemMaps.
    // Caveat - the order of the roleMenuItemMaps fetched is indeterminate

    // delete all records and insert four roleMenuItemMaps
    let object3 = {
      // add a valid masterCurrency object
      "tenantId": "tenId3",
      "currencyCode": "cuobj",
      "currencyName": "dollar",
      "decimalDigit": "8",
      "delimiter": "1",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "objVersion": 123,
      "enabledFlag": "1",
      "currencyLocale": "BANK"
    };
    let object4 = {
      // add a valid masterCurrency object
      "tenantId": "tenId4",
      "currencyCode": "cect4",
      "currencyName": "tenR",
      "decimalDigit": "3",
      "delimiter": "2",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "objVersion": 123,
      "enabledFlag": "1",
      "currencyLocale": "BANK"
    };
    beforeEach((done) => {
      masterCurrency.deleteAll().then(() => {
        masterCurrency.save(object1).then((res) => {
          masterCurrency.save(object2).then((res) => {
            masterCurrency.save(object3).then((res) => {
              masterCurrency.save(object4).then((res) => {
                done();
              });
            });
          });
        });
      });
    });

    it("should return limited number of records", (done) => {
      let res = masterCurrency.findAll(4);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(4);
          expect(docs[0])
            .to.include(object1);
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should return all records if value of limit parameter is less than 1 i.e, 0 or -1", (done) => {
      let res = masterCurrency.findAll(-1);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(4);
          expect(docs[0])
            .to.include(object1);
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  // describe("testing roleMenuItemMap.find without data", () => {
  //   // delete all records
  //   // find should return empty array
  //   beforeEach((done) => {
  //     masterCurrency.deleteAll()
  //       .then((res) => {
  //         done();
  //       });
  //   });
  //
  //   it("should return empty array i.e. []", (done) => {
  //     let res = masterCurrency.findAll(2);
  //     expect(res)
  //       .to.be.fulfilled.then((docs) => {
  //         expect(docs)
  //           .to.be.a('array');
  //         expect(docs.length)
  //           .to.equal(0);
  //         expect(docs)
  //           .to.eql([]);
  //         done();
  //       }, (err) => {
  //         done(err);
  //       })
  //       .catch((e) => {
  //         done(e);
  //       });
  //   });
  // });
  //
  // describe("testing masterCurrency.findById", () => {
  //   // Delete all records, insert one record , get its id
  //   // 1. Query by this id and it should return one masterCurrency
  //   // 2. Query by an arbitrary id and it should return {}
  //   // 3. Query with null id and it should throw IllegalArgumentException
  //   // 4. Query with undefined and it should throw IllegalArgumentException
  //   // 5. Query with arbitrary object
  //   let testObject = {
  //     //add a valid masterCurrency object
  //
  //   };
  //   var id;
  //   beforeEach((done) => {
  //     masterCurrency.deleteAll()
  //       .then((res) => {
  //         masterCurrency.save(testObject)
  //           .then((savedObj) => {
  //             id = savedObj._id;
  //             done();
  //           });
  //       });
  //   });
  //
  //   it("should return masterCurrency identified by Id ", (done) => {
  //     let res = masterCurrency.findById(id);
  //     expect(res)
  //       .to.eventually.include(testObject)
  //       .notify(done);
  //   });
  //
  //   it("should return null as no masterCurrency is identified by this Id ", (done) => {
  //     let badId = new mongoose.mongo.ObjectId();
  //     let res = masterCurrency.findById(badId);
  //     expect(res)
  //       .to.eventually.to.eql(null)
  //       .notify(done);
  //   });
  // });
  //
  // describe("testing masterCurrency.findOne", () => {
  //   // Delete all records, insert two record
  //   // 1. Query by one attribute and it should return one masterCurrency
  //   // 2. Query by an arbitrary attribute value and it should return {}
  //
  //   // delete all records and insert two masterCurrencys
  //   beforeEach((done) => {
  //     masterCurrency.deleteAll()
  //       .then((res) => {
  //         masterCurrency.save(object1)
  //           .then((res) => {
  //             masterCurrency.save(object2)
  //               .then((savedObj) => {
  //                 done();
  //               });
  //           });
  //       });
  //   });
  //
  //   it("should return object for valid attribute value", (done) => {
  //     // take one valid attribute and its value
  //     let attributename = "";
  //     let attributeValue = "";
  //     let res = masterCurrency.findOne(attributename, attributeValue);
  //     expect(res)
  //       .to.eventually.include(object1)
  //       .notify(done);
  //   });
  //
  //   it("should return null as no masterCurrency is identified by this attribute ", (done) => {
  //     let res = masterCurrency.findOne(validAttribute, invalidValue);
  //     expect(res)
  //       .to.eventually.to.eql(null)
  //       .notify(done);
  //   });
  // });
  //
  // describe("testing masterCurrency.findMany", () => {
  //   // Delete all records, insert two record
  //   // 1. Query by one attribute and it should return all masterCurrencys having attribute value
  //   // 2. Query by an arbitrary attribute value and it should return {}
  //   let masterCurrency1 = {
  //     //add valid object
  //
  //   };
  //   let masterCurrency2 = {
  //     //add valid object with one attribute value same as "masterCurrency1"
  //
  //   };
  //   // delete all records and insert two masterCurrencys
  //   beforeEach((done) => {
  //     masterCurrency.deleteAll()
  //       .then((res) => {
  //         masterCurrency.save(masterCurrency1)
  //           .then((res) => {
  //             masterCurrency.save(masterCurrency2)
  //               .then((savedObj) => {
  //                 done();
  //               });
  //           });
  //       });
  //   });
  //
  //   it("should return array of objects for valid attribute value", (done) => {
  //     // take one valid attribute and its value
  //     let attributename = "";
  //     let attributeValue = "";
  //     let res = masterCurrency.findMany(attributename, attributeValue);
  //     expect(res).to.eventually.be.a("array");
  //     //enter proper length according to input attribute
  //     expect(res).to.eventually.have.length(1);
  //     done();
  //   });
  //
  //   it("should return empty array as no masterCurrency is identified by this attribute ", (done) => {
  //     let res = masterCurrency.findMany(validAttribute, invalidValue);
  //     expect(res)
  //       .to.eventually.to.eql([])
  //       .notify(done);
  //   });
  // });
});