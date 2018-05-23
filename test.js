var request = require("request");
var cheerio = require("cheerio");
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://scraping-db.firebaseio.com/'
});
var url = [
    "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php",
    "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php?Page=2&search=&section=All",
    "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php?Page=3&search=&section=All",
    "https://www.nstda.or.th/recruit/hrms/pages/pub.publish.php?Page=4&search=&section=All"
];
// for (var i = 2; i < 4; i++) {
//     url.push("http://www.centralsmartjobs.com/th/job/List?page="+i+"&lc=0&pp=10");
// }

var url2 = url;
var i;
var items2 = [];
var nstdaset = [];
var jobthaiset = [];


async function t1() {
    return new Promise((resolve, rejext) => {
        url.forEach((site, i) => {
            request(site, (err, respone, html) => {
                if (!err) {
                    var $ = cheerio.load(html);
                    var jobs = $('.span8');
                    var items = [];
                    var job = [];
                    var links = [];
                    url2.forEach((site2, index) => {
                        if (site == site2) {
                            url2.slice(index, 1);
                            jobs.find("tr.table_text_detail").each(async (index, element) => {
                                var temp = $(element).attr('onclick').split('"');
                                links.push("https://www.nstda.or.th/recruit/hrms/pages/" + temp[1]);
                                // var linkss = "https://www.nstda.or.th/recruit/hrms/pages/" + temp[1];
                                // nstdaset.push(links);
                            });
                        }
                    });
                }
                resolve(nstdaset);
            });
        });
        console.log("t1");
    });
}

async function t2() {
    return new Promise((resolve, reject) => {
        const nstda = 'https://scraping-db.firebaseio.com/NSTDA.json';
        request({
            url: nstda,
            json: true
        }, function (error, response, body) {
            body.forEach((element, index) => {
                element.data.forEach(element2 => {
                    const temp = element2.split(";");
                    // console.log(temp[1]);
                    nstdaset.push(temp[1]);
                });
            });
            console.log("t2");
            resolve(nstdaset);
        });
    });
    //  nstdaset.forEach((site, i) => {
    //     request(site, async function (err, respone, html) {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $('.span8');
    //             var items = [];
    //             var itemss = [];
    //             var links = [];
    //             nstdaset2.forEach(async (site2, index) => {
    //                 if (site == site2) {
    //                     nstdaset2.slice(index, 1);
    //                     jobs.find(".detail_text").each(function (index, element) {
    //                         if(index < 7){
    //                             items.push($(element).text().trim());
    //                         }
    //                     });
    //                 }
    //             });
    //             console.log(items);

    //         }
    //     });
    // });
}
// async function t3() {
//     let nstdaset2 = nstdaset;
//     console.log(nstdaset2);

// }

async function t4() {
    let nstdaset2 = links;
    console.log(nstdaset2);

    // links.forEach((site, i) => {
    //     request(site, (err, respone, html) => {
    //         if (!err) {
    //             var $ = cheerio.load(html);
    //             var jobs = $('.span8');
    //             var items = [];
    //             var links = [];
    //             nstdaset2.forEach(async (site2, index) => {
    //                 if (site == site2) {
    //                     nstdaset2.slice(index, 1);
    //                     jobs.find(".detail_text").each((index, element) => {
    //                         if (index < 7) {
    //                             items.push($(element).text().trim());
    //                         }
    //                     });
    //                 }
    //             });
    //             data = {
    //                 name: i,
    //                 data: items,
    //             };
    //             const db = admin.database();
    //             const ref = db.ref("NSTDA_Detail");
    //             const child = ref.child(i);
    //             child.set(data);
    //         } else {
    //             console.log(err);
    //         }
    //     });
    // });
    console.log("t4");

}
async function b() {
    t2().then((nstdaset) => {
        let nstdaset2 = nstdaset;
        // console.log(data2);
        nstdaset.forEach((site, i) => {
            request(site, (err, respone, html) => {
                if (!err) {
                    var $ = cheerio.load(html);
                    var jobs = $('.span8');
                    var items = [];
                    var links = [];
                    nstdaset2.forEach(async (site2, index) => {
                        if (site == site2) {
                            nstdaset2.slice(index, 1);
                            jobs.find(".detail_text").each((index, element) => {
                                if (index < 7) {
                                    items.push($(element).text().trim());
                                }
                            });
                        }
                    });
                    data = {
                        name: i,
                        data: items,
                    };
                    const db = admin.database();
                    const ref = db.ref("NSTDA_Detail");
                    const child = ref.child(i);
                    child.set(data);
                } else {
                    console.log(err);
                }
            });
        });
    });
    // await t4();
}

b();