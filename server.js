var request = require("request");
var cheerio = require("cheerio");
var mysql = require('mysql');
var fs = require("fs");
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
let app = require('express')();
let http = require('http').Server(app);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://scraping-db.firebaseio.com/'
});




app.get('/write', function(req, res){
var url = [
    "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2.html",
    "https://www.jobthai.com/%E0%B8%AB%E0%B8%B2%E0%B8%87%E0%B8%B2%E0%B8%99/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94.html"
]; 

var url2 = url;
var i;

url.forEach(site => {
    request(site, function(err, respone, html){
        if(!err) {
            var $ = cheerio.load(html);
            var jobs = $("#content-l");
            var type = $("#JobType");
            var types = [];
            var items = [];
            var links = [];
            
            url2.forEach((site2,index) => {
                if(site == site2){
                    url2.slice(index,1);
                    jobs.find("span.head2 a.searchjob").each(function (index, element) {
                        items.push($(element).text());
                        if($(element).attr('href').includes("www")){
                            links.push($(element).attr('href'));
                        }else {
                            links.push("https://www.jobthai.com/" + $(element).attr('href').substr(3));
                        }
                    });
                fs.writeFile("output1"+ index +".txt", JSON.stringify(items, null, 4), function(err){});
                fs.writeFile("output2"+ index +".txt", JSON.stringify(links, null, 4), function(err){});
                }
            });
            jobs = [];
            items.forEach((item,index) => {
                item = item +","+ links[index];
                // console.log(item);
                jobs.push(item);
            });
            const db = admin.database();

            var webName = site.split('/');
            var webName2 = webName[4].split('.');

            // console.log('/'+webName[3]+'/'+webName2[0]);
            
            const ref = db.ref(webName2[0]);
            ref.set(jobs);
            

        }
    });
});
});

http.listen(5000, () =>{
	console.log('started on port 5000');
});