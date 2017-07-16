let rp =require("request-promise") 
let chr = require("cheerio-httpcli") //jqueryに似た書き方でdom操作ができる

function getAtcoderRate(userId){
    //このpromiseでthenを呼ぶとcheerioのfetchが実行される。
    //cheerioのthen, catchのどちらかでresolve, rejectが呼ばれれば終了
    return new Promise(function(resolve, reject){
            console.log("in function.")

            chr.fetch('https://atcoder.jp/user/' + userId) //scrape
                .then(function(res){
                    let $ = res.$;
                    let nowRate = parseInt( $('dd').eq(5).text()) 
                    let maxRate = parseInt( $('dd').eq(6).text())
                    console.log(nowRate)
                    console.log(maxRate)
                    resolve({now:nowRate, max: maxRate});
                })
                .catch(function(err){
                    console.log(err);
                    reject()
                })
        })
}

function getCodeforcesRate(userId){
    return rp({
            method:'GET',
            json: true,
            uri: 'http://codeforces.com/api/user.info',
            qs:{
                'handles': userId
            }
        }).then(function(res){ 
            return new Promise(function(resolve, reject){
                resolve({now: parseInt(res.result[0].rating), max: parseInt(res.result[0].maxRating)}) 
            })
        })
}

function getTopcoderRate(userId){
    return rp({
            method:'GET',
            json: true,
            uri: 'http://api.topcoder.com/v2/users/' + userId + '/statistics/data/srm'
        }).then(function(res){ 
            return new Promise(function(resolve, reject){
                resolve({now: parseInt(res.rating), max: parseInt(res.maximumRating)}) 
            })
        })
}

function getHtmlForRate(rate /*int*/, contest /*string*/){
    let thresholds
    let classes

    switch(contest){
        case 'codeforces':
            thresholds = [1200, 1400, 1600, 1900, 2200, 2400, 10000]
            classes = ['user-gray', 'user-green', 'user-cyan', 'user-blue',
                    'user-violet', 'user-orange', 'user-red']
            break
        
        case 'topcoder':
            thresholds = [900, 1200, 1500, 2200, 10000]
            classes = ['user-gray', 'user-green', 'user-blue', 'user-yerrow', 'user-red']
            break

        case 'atcoder':
        default:
                        //gray, brown, green, cyan, blue, yellow, orange, red 
            thresholds  = [400, 800, 1200, 1600, 2000, 2400, 2800, 10000]
            classes     = ['user-gray', 'user-brown', 'user-green', 'user-cyan',
                        'user-blue', 'user-yellow', 'user-orange', 'user-red' ]
            break
        
    }
    for (let i in thresholds){
        if(rate < thresholds[i])
            return '<div class="' + classes[i] + '">' + String(rate) + '</div>'   
    }
}

getAtcoderRate("yoyoyousei").then(function(res){console.log(res)
console.log(getHtmlForRate(res.now, "atcoder"))})

getCodeforcesRate('yousei').then(function(res){console.log(res)
console.log(getHtmlForRate(res.now, "codeforces"))})

getTopcoderRate('camshift').then(function(res){console.log(res)
console.log(getHtmlForRate(res.now, "topcoder"))})