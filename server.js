var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
let app = require('express')();
let http = require('http').Server(app);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://scraping-db.firebaseio.com/'
});

app.get('/write', function (req, res) {
    var url = [
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3-%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%A7%E0%B8%99-%E0%B8%9B%E0%B8%A8%E0%B8%B8%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%87-%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%A3%E0%B9%88.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%82%E0%B8%B2%E0%B8%A2.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%81%E0%B8%9A%E0%B8%9A-%E0%B8%87%E0%B8%B2%E0%B8%99Drawing-AutoCad-%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%84%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B4%E0%B8%99%E0%B8%84%E0%B9%89%E0%B8%B2-%E0%B9%82%E0%B8%A5%E0%B8%88%E0%B8%B4%E0%B8%AA%E0%B8%95%E0%B8%B4%E0%B8%81%E0%B8%AA%E0%B9%8C-Supply-Chain.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C-IT-%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%81%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%A1%E0%B8%AD%E0%B8%A3%E0%B9%8C.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%87-%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%81%E0%B8%AA%E0%B8%94%E0%B8%87-%E0%B8%99%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%9A%E0%B8%9A-%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%87-Stylist-Costume.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD-%E0%B8%98%E0%B8%B8%E0%B8%A3%E0%B8%81%E0%B8%B2%E0%B8%A3-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%AA%E0%B8%B2%E0%B8%99%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B9%84%E0%B8%9B.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%80%E0%B8%88%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%A0%E0%B8%B1%E0%B8%A2-%E0%B8%88%E0%B8%9B-%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B9%81%E0%B8%A7%E0%B8%94%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%A1-ISO.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84-%E0%B8%AD%E0%B8%B4%E0%B9%80%E0%B8%A5%E0%B8%84%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%99%E0%B8%B4%E0%B8%84-%E0%B8%8B%E0%B9%88%E0%B8%AD%E0%B8%A1%E0%B8%9A%E0%B8%B3%E0%B8%A3%E0%B8%B8%E0%B8%87-%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99-%E0%B8%9A%E0%B8%A3%E0%B8%A3%E0%B8%93%E0%B8%B2%E0%B8%98%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3-%E0%B8%9E%E0%B8%B4%E0%B8%AA%E0%B8%B9%E0%B8%88%E0%B8%99%E0%B9%8C%E0%B8%AD%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%A3-Copywriter-%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%81%E0%B8%9B%E0%B8%A5%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B2.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%99%E0%B8%B3%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2-%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%AD%E0%B8%AD%E0%B8%81-Shipping-%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B9%88%E0%B8%AD%E0%B8%95%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8-BOI.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A5%E0%B8%B9%E0%B8%81%E0%B8%84%E0%B9%89%E0%B8%B2-Call-Center-%E0%B8%9E%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%9A-%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A8%E0%B8%B1%E0%B8%9E%E0%B8%97%E0%B9%8C.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%9A%E0%B8%B1%E0%B8%8D%E0%B8%8A%E0%B8%B5-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5-%E0%B8%9D%E0%B8%B6%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%A3%E0%B8%A1.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%9C%E0%B8%A5%E0%B8%B4%E0%B8%95-%E0%B8%84%E0%B8%A7%E0%B8%9A%E0%B8%84%E0%B8%B8%E0%B8%A1%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%9E-%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3-%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%AD%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%A2%E0%B8%81%E0%B8%B2%E0%B8%A3-MD-CEO.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%9B%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%A0%E0%B8%B1%E0%B8%A2-%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AD%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B8%88%E0%B8%AD%E0%B8%94%E0%B8%A3%E0%B8%96.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B8%A2%E0%B9%8C-%E0%B9%80%E0%B8%A0%E0%B8%AA%E0%B8%B1%E0%B8%8A%E0%B8%81%E0%B8%A3-%E0%B8%AA%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B8%AA%E0%B8%B8%E0%B8%82.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-GIS-%E0%B8%9C%E0%B8%B1%E0%B8%87%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%81%E0%B8%A1%E0%B9%88%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%A5%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%87-%E0%B8%84%E0%B8%99%E0%B8%AA%E0%B8%A7%E0%B8%99.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%82%E0%B8%A2%E0%B8%98%E0%B8%B2-%E0%B8%AA%E0%B8%B3%E0%B8%A3%E0%B8%A7%E0%B8%88-%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%9B%E0%B8%B1%E0%B8%95%E0%B8%A2%E0%B9%8C-%E0%B8%A1%E0%B8%B1%E0%B8%93%E0%B8%91%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%A3-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%A1%E0%B8%B4%E0%B8%99%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%B2.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%80%E0%B8%A3%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%94%E0%B8%AB%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%AA%E0%B8%B4%E0%B8%99-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%99%E0%B8%AD%E0%B8%A1%E0%B8%AB%E0%B8%99%E0%B8%B5%E0%B9%89.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A5%E0%B9%88%E0%B8%B2%E0%B8%A1-%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%84%E0%B8%B8%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B8%81%E0%B9%8C-%E0%B8%88%E0%B8%AD%E0%B8%87%E0%B8%AB%E0%B9%89%E0%B8%AD%E0%B8%87-%E0%B8%88%E0%B8%AD%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B9%8B%E0%B8%A7.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B8%B2%E0%B8%99%E0%B8%B8%E0%B8%81%E0%B8%B2%E0%B8%A3.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-Lab-%E0%B8%A7%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%A2%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A7%E0%B8%B4%E0%B8%88%E0%B8%B1%E0%B8%A2-%E0%B8%A7%E0%B8%B4%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%B0%E0%B8%AB%E0%B9%8C-%E0%B9%80%E0%B8%A8%E0%B8%A3%E0%B8%A9%E0%B8%90%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%A0%E0%B8%B1%E0%B8%A2-%E0%B8%98%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B8%B0-%E0%B8%81%E0%B8%A3%E0%B8%B2%E0%B8%9F%E0%B8%9F%E0%B8%B4%E0%B8%84-%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A-%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A0%E0%B8%B2%E0%B8%9E.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3-%E0%B8%82%E0%B8%B1%E0%B8%9A%E0%B8%A3%E0%B8%96-%E0%B8%AA%E0%B9%88%E0%B8%87%E0%B8%9C%E0%B8%A5%E0%B8%B4%E0%B8%95%E0%B8%A0%E0%B8%B1%E0%B8%93%E0%B8%91%E0%B9%8C.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AA%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B8%A1%E0%B8%A7%E0%B8%A5%E0%B8%8A%E0%B8%99-%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A7-%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B8-%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%97%E0%B8%B1%E0%B8%A8%E0%B8%99%E0%B9%8C-%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%A0%E0%B8%B2%E0%B8%9E-%E0%B9%82%E0%B8%A0%E0%B8%8A%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3-%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%87%E0%B8%B2%E0%B8%A1-%E0%B8%9F%E0%B8%B4%E0%B8%95%E0%B9%80%E0%B8%99%E0%B8%AA-%E0%B8%AA%E0%B8%9B%E0%B8%B2.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%9C%E0%B9%89%E0%B8%B2-%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%AD-%E0%B8%8A%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%9E%E0%B8%97%E0%B9%80%E0%B8%97%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%99.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AD%E0%B8%AD%E0%B8%81%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A%E0%B9%84%E0%B8%8B%E0%B8%95%E0%B9%8C-Web.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AD%E0%B8%B1%E0%B8%8D%E0%B8%A1%E0%B8%93%E0%B8%B5%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AD%E0%B8%B2%E0%B8%88%E0%B8%B2%E0%B8%A3%E0%B8%A2%E0%B9%8C-%E0%B8%84%E0%B8%A3%E0%B8%B9-%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%94%E0%B8%B7%E0%B9%88%E0%B8%A1-%E0%B8%81%E0%B8%B8%E0%B9%8A%E0%B8%81-%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%97%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%9E%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%AA%E0%B8%B4%E0%B8%A3%E0%B9%8C%E0%B8%9F.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%87%E0%B8%B2%E0%B8%99-Part-time-%E0%B8%9E%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%A7.html",
        "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/Freelance.html",
        "https://www.jobthai.com/home/job_list.php?StepSearch=1&Type=NormalSearch&l=th&Region=All&ProvinceIIE=All&IIECode=All&JobType=Other&SubJobType=&KeyWord="

    ];
    var url2 = url;
    //------------------------
    var nstda = [
        "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php",
        "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php?Page=2&search=&section=All",
        "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php?Page=3&search=&section=All",
        "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php?Page=4&search=&section=All"
    ];
    var nstda2 = nstda;
    //------------------------
    var JobBKK = [];
    for (var i = 1; i < 10; i++) {
        JobBKK.push("https://www.jobbkk.com/jobs/lists/"+i+"/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99,%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94,%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94,%E0%B8%97%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%94.html?keyword_type=1");
    }
    var JobBKK2 = JobBKK;
    //------------------------
    var jobthaiweb = [];
    for (var i = 1; i < 10; i++) {
        jobthaiweb.push("http://www.jobthaiweb.com/joblist_new.php?page=" + i + "&key=&typejob=&jobcity=&jobarea=&row=16368&order=&search=");
    }
    var jobthaiweb2 = jobthaiweb;
    //--------------------------
    var pasona = [
        "https://pasona.co.th/"
    ];
    var pasona2 = pasona;
    //------------------------------
    var jobsugoi = [
        "https://www.jobsugoi.com/job_search?mode=job_search&hjobsearch_state=&page=1&save_search=&job_tag=&search_job_type=3&keyword_search=&mh_category_count=&job_cate_text=&h_category_count=&salary_start=&salary_end=&job_industry_id=&jobsearch_education=&age=&job_type="
    ];
    for (var i = 2; i < 10; i++) {
        jobsugoi.push("https://www.jobsugoi.com/job_search?mode=job_search&hjobsearch_state=&page="+i+"&save_search=&job_tag=&search_job_type=3&keyword_search=&mh_category_count=&job_cate_text=&h_category_count=&salary_start=&salary_end=&job_industry_id=&jobsearch_education=&age=&job_type=");
    }
    var jobsugoi2 = jobsugoi;
    //--------------------------
    var jobnorththailand = [
        "https://www.jobnorththailand.com/joblist.php"
    ];
    for (var i = 2; i < 10; i++) {
        jobnorththailand.push("https://www.jobnorththailand.com/joblist.php?page="+i+"&cksort=&id_jtm=&id_jts=&se_keyword=&se_position=&se_company=&se_salary=&se_study=&province=&se_exp=&se_sexm=&se_sexf=&se_levelstudy=&tview=0");
    }
    var jobnorththailand2 = jobnorththailand;
    //-------------------------------------
    var service_job = [
        "https://www.หางานราชการ.net/"
    ];
    var service_job2 = service_job;
    //----------------------------------
    var chiangraifocus = [
        "http://www.chiangraifocus.com/jobs/jobslist.php"
    ];
    for (var i = 1; i < 10; i++) {
        chiangraifocus.push("http://www.chiangraifocus.com/jobs/jobslist.php?s_page="+i+"&urlquery_str=#jobslist");
    }
    var chiangraifocus2 = chiangraifocus;
    //------------------------------------
    var centralsmartjobs = [
        "http://www.centralsmartjobs.com/th/job/list"
    ];
    for (var i = 2; i < 10; i++) {
        centralsmartjobs.push("http://www.centralsmartjobs.com/th/job/List?page="+i+"&lc=0&pp=10");
    }
    var centralsmartjobs2 = centralsmartjobs;
    //#region jobthai
    // var i;
    // url.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $("#content-l");
    //             var type = $("#JobType");
    //             var types = [];
    //             var items = [];
    //             var links = [];

    //             url2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     url2.slice(index, 1);
    //                     jobs.find("span.head2 a.searchjob").each(function (index, element) {
    //                         items.push($(element).text());
    //                         if ($(element).attr('href').includes("www")) {
    //                             links.push($(element).attr('href'));
    //                         } else {
    //                             links.push("https://www.jobthai.com/" + $(element).attr('href').substr(3));
    //                         }
    //                     });
    //                     // fs.writeFile("output1"+ index +".txt", JSON.stringify(items, null, 4), function(err){});
    //                     // fs.writeFile("output2"+ index +".txt", JSON.stringify(links, null, 4), function(err){});
    //                 }
    //             });
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[4].split('.');

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2[0],
    //                 data: jobs,
    //             };

    //             const ref = db.ref("JobThai");
    //             const child = ref.child(i);
    //             child.set(data);
    //         }
    //     });
    // });
    //#endregion jobthai
    //#region nstda
    i = 0;
    nstda.forEach((site, i) => {
        request(site, function (err, respone, html) {
            if (!err) {
                var $ = cheerio.load(html);
                var jobs = $(".span8");
                var items = [];
                var links = [];

                nstda2.forEach((site2, index) => {
                    if (site == site2) {
                        nstda2.slice(index, 1);
                        jobs.find("tr.table_text_detail").each(function (index, element) {
                            var temp = $(element).attr('onclick').split('"');
                            links.push("https://www.nstda.or.th/recruit/hrms/pages/" + temp[1]);
                        });
                        jobs.find("td.table_text_detail").each(function (index, element) {
                            if ((index % 4) == 0) {
                                items.push($(element).text());
                            }
                        });
                    }
                });
                jobs = [];
                
                items.forEach((item, index) => {
                    item = item + ";" + links[index];
                    // console.log(item);
                    jobs.push(item);
                });
                const db = admin.database();

                var webName = site.split('/');
                var webName2 = webName[6].split('.');

                // console.log('/'+webName[3]+'/'+webName2[0]);

                data = {
                    name: i,
                    data: jobs,
                };

                const ref = db.ref("NSTDA");
                const child = ref.child(i);
                child.set(data);
            }else{
                console.log(err);
                
            }
        });
    });
    // //#endregion
    // //#region JobBKK
    // // i = 0;
    // // JobBKK.forEach((site, i) => {
    // //     request(site, function (err, respone, html) {
    // //         if (!err) {
    // //             var $ = cheerio.load(html);
    // //             var jobs = $("#box_left1");
    // //             var items = [];
    // //             var links = [];

    // //             JobBKK2.forEach((site2, index) => {
    // //                 if (site == site2) {
    // //                     JobBKK2.slice(index, 1);
    // //                     jobs.find(".jsearchCon h6 a").each(function (index, element) {
    // //                         items.push($(element).text());
    // //                         links.push($(element).attr('href'));
    // //                     });
    // //                 }
    // //             });
    // //             jobs = [];
    // //             items.forEach((item, index) => {
    // //                 item = item + ";" + links[index];
    // //                 // console.log(item);
    // //                 jobs.push(item);
    // //             });
    // //             const db = admin.database();

    // //             var webName = site.split('/');
    // //             var webName2 = webName[5];

    // //             // console.log('/'+webName[3]+'/'+webName2[0]);

    // //             data = {
    // //                 name: webName2,
    // //                 data: jobs,
    // //             };

    // //             const ref = db.ref("JobBKK");
    // //             const child = ref.child(i);
    // //             child.set(data);
    // //             // console.log(items);

    // //         }
    // //     });
    // // });
    // //#endregion JobBKK
    // //#region jobthaiweb
    // i = 0;
    // jobthaiweb.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $("center center");
    //             var items = [];
    //             var links = [];

    //             jobthaiweb2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     jobthaiweb2.slice(index, 1);
    //                     jobs.find("#block1 a font").each(function (index, element) {
    //                         items.push($(element).text());
    //                     });
    //                     jobs.find("#block5 a").each(function (index, element) {
    //                         links.push("http://www.jobthaiweb.com" + $(element).attr('href'));
    //                     });
    //                 }
    //             });
                
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[3].split(".");

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2[1],
    //                 data: jobs,
    //             };

    //             const ref = db.ref("JobThaiWeb");
    //             const child = ref.child(i);
    //             child.set(data);
    //             // console.log(items);

    //         }
    //     });
    // });
    // //#endregion jobthaiweb
    // //#region service
    // i = 0;
    // pasona.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $(".col-sm-8");
    //             var items = [];
    //             var links = [];

    //             pasona2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     pasona2.slice(index, 1);
    //                     jobs.find(".mb").each(function (index, element) {
    //                         if($(element).text() != ""){
    //                             items.push($(element).text());
    //                         }
    //                     });
    //                     jobs.find(".job-list").each(function (index, element) {
    //                         if($(element).text() != ""){
    //                             links.push("https://pasona.co.th" + $(element).attr('href'));
    //                         }
    //                     });
    //                 }
    //             });
                
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[2];

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2,
    //                 data: jobs,
    //             };

    //             const ref = db.ref("Pasona");
    //             const child = ref.child(i);
    //             child.set(data);
    //             // console.log(items);

    //         }
    //     });
    // });
    // //#endregion service
    // //#region jobsugoi
    // i = 0;
    // jobsugoi.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $("#formApply");
    //             var items = [];
    //             var links = [];

    //             jobsugoi2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     jobsugoi2.slice(index, 1);
    //                     jobs.find(".position").each(function (index, element) {
    //                         items.push($(element).text().replace(/[\n\r\t]+/g, ''));
    //                         var temp = $(element).attr('onclick').split("'");
    //                         links.push(temp[1]);
    //                     });
    //                 }
    //             });
                
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[2];

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2,
    //                 data: jobs,
    //             };

    //             const ref = db.ref("JobSugoi");
    //             const child = ref.child(i);
    //             child.set(data);
    //             // console.log(items);

    //         }
    //     });
    // });
    // //#endregion jobsugoi
    // //#region jobnorththailand
    // i = 0;
    // jobnorththailand.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $(".m_border1");
    //             var items = [];
    //             var links = [];

    //             jobnorththailand2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     jobnorththailand2.slice(index, 1);
    //                     jobs.find("a.Mlink_to_G").each(function (index, element) {
    //                         items.push($(element).text());
    //                         links.push("https://www.jobnorththailand.com/" + $(element).attr('href'));
    //                     });
    //                 }
    //             });
                
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[2];

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2,
    //                 data: jobs,
    //             };

    //             const ref = db.ref("JobNorThthailand");
    //             const child = ref.child(i);
    //             child.set(data);
    //             // console.log(items);

    //         }
    //     });
    // });
    // //#endregion jobnorththailand
    // //#region service
    // i = 0;
    // service_job.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $(".row");
    //             var items = [];
    //             var links = [];

    //             service_job2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     service_job2.slice(index, 1);
    //                     jobs.find(".subject").each(function (index, element) {
    //                         items.push($(element).text());
    //                         // links.push($(element).attr('href'));
    //                     });
    //                     jobs.find(".guide-list a").each(function (index, element) {
    //                         links.push("https://www.หางานราชการ.net/" + $(element).attr('href'));
    //                     });
    //                 }
    //             });
                
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[2];

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2,
    //                 data: jobs,
    //             };

    //             const ref = db.ref("Service");
    //             const child = ref.child(i);
    //             child.set(data);
    //             // console.log(items);

    //         }
    //     });
    // });
    // //#endregion
    // //#region Chiangrai
    // i = 0;
    // chiangraifocus.forEach((site, i) => {
    //     request(site, function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $(".font14");
    //             var items = [];
    //             var links = [];

    //             chiangraifocus2.forEach((site2, index) => {
    //                 if (site == site2) {
    //                     chiangraifocus2.slice(index, 1);
    //                     jobs.find("a").each(function (index, element) {
    //                         if(index > 14 && index < 65){
    //                             items.push($(element).text());
    //                             links.push($(element).attr('href'));
    //                         }
    //                     });
    //                 }
    //             });
                
    //             jobs = [];
    //             items.forEach((item, index) => {
    //                 item = item + ";" + links[index];
    //                 // console.log(item);
    //                 jobs.push(item);
    //             });
    //             const db = admin.database();

    //             var webName = site.split('/');
    //             var webName2 = webName[2];

    //             // console.log('/'+webName[3]+'/'+webName2[0]);

    //             data = {
    //                 name: webName2,
    //                 data: jobs,
    //             };

    //             const ref = db.ref("ChiangraiFocus");
    //             const child = ref.child(i);
    //             child.set(data);
    //             // console.log(items);

    //         }
    //     });
    // });
    // //#endregion 
    // //#region Central
    // // i = 0;
    // // centralsmartjobs.forEach((site, i) => {
    // //     request(site, function (err, respone, html) {
    // //         if (!err) {
    // //             var $ = cheerio.load(html);
    // //             var jobs = $("#Div1");
    // //             var items = [];
    // //             var links = [];

    // //             centralsmartjobs2.forEach((site2, index) => {
    // //                 if (site == site2) {
    // //                     centralsmartjobs2.slice(index, 1);
    // //                     jobs.find(".red a").each(function (index, element) {
    // //                         items.push($(element).text().trim());
    // //                         links.push("http://www.centralsmartjobs.com"+$(element).attr('href'));
    // //                     });
    // //                 }
    // //             });
                
    // //             jobs = [];
    // //             items.forEach((item, index) => {
    // //                 item = item + ";" + links[index];
    // //                 // console.log(item);
    // //                 jobs.push(item);
    // //             });
    // //             const db = admin.database();

    // //             var webName = site.split('/');
    // //             var webName2 = webName[2];

    // //             // console.log('/'+webName[3]+'/'+webName2[0]);

    // //             data = {
    // //                 name: webName2,
    // //                 data: jobs,
    // //             };

    // //             const ref = db.ref("Central");
    // //             const child = ref.child(i);
    // //             child.set(data);
    // //             // console.log(items);
    
    // //         }
    // //     });
    // // });
    // //#endregion
});

http.listen(5000, () => {
    console.log('started on port 5000');
});