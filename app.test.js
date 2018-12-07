var express = require('express'); 
var request = require('supertest');
const app = require("./app");

describe('tests', function () {

    it('Render review page', function (done) {
        request(app)
          .get("/reviews")    
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(200, done);
    });
});

