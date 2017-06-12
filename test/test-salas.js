require('dotenv').load();
process.env.NODE_ENV = 'test';

var model = require('seraph-model');
var confDB = require('../api/config/db');
var db = require('seraph')({
    server: confDB.db.server,
    user: confDB.db.user,
    pass: confDB.db.pass
});

var should = require('should');
var assert = require('assert');
var request = require('supertest');

var url = 'http://localhost:8080';


var deleteDBQuery = "MATCH (n) DETACH DELETE n";


describe('Tests salas', function() {


});