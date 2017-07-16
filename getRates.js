let chr = require("cheerio-httpcli")


//
function getAtcoderRate(userId){
    //このpromiseから現在のレートが帰る
    return new Promise(function(resolve, reject){
            console.log("in function.")

            chr.fetch('https://atcoder.jp/user/' + userId)
                .then(function(res){
                    let $ = res.$;
                    let nowRate = parseInt( $('dd').eq(5).text())
                    let maxRate = parseInt( $('dd').eq(6).text())
                    console.log(nowRate)
                    console.log(maxRate)
                    let ret = {}
                    ret['now'] = nowRate
                    ret['max'] = maxRate
                    resolve(ret);
                })
                .catch(function(err){
                    console.log(err);
                    reject()
                })
    })
}

function getHtmlForAtcoderRate(rate){ //rate: int
                    //gray, brown, green, cyan, blue, yellow, orange, red 
    let thresholds  = [400, 800, 1200, 1600, 2000, 2400, 2800, 10000]
    let classes     = ['user-gray', 'user-brown', 'user-green', 'user-cyan',
                        'user-blue', 'user-yellow', 'user-orange', 'user-red' ]
    for (let i in thresholds){
        if(rate < thresholds[i]){
            return '<div class="' + classes[i] + '">' 
                                + String(rate) + '</div>'
        }
    }
}

function getHtmlForCodeforcesRate(rate){
    let thresholds = [1200, 1400, 1600, 1900, 2300, 10000]
    let classes = ['user-gray', 'user-green', 'user-cyan', 'user-blue',
                    'user-violet', 'user-orange', 'user-red']
}


    // console.log("option: " + JSON.stringify(optionA))
    // rp(optionA).then(function(error, response, body){
    //         if(!error && response.statusCode == 200){
                
    //             let $ = chr.load(body);
    //             let nowRate = parseInt( $('dd').eq(5).text() )
    //             let maxRate = parseInt( $('dd').eq(6).text() )
    //             console.log(Json.stringify({nowR:nowRate, maxR: maxRate}))
    //             return {nowR:nowRate, maxR: maxRate}
    //         }else {
    //             console.log("--------------------------------------------------");
    //             if (error && "code" in error) {
    //                 console.log("Error Code:" + error.code);
    //             }
    //             if (error && "errno" in error) {
    //                 console.log("Error No:" + error.errno);
    //             }
    //             if (error && "syscall" in error) {
    //                 console.log("Error Syscall:" + error.syscall);
    //             }
    //             if (response && "statusCode" in response) {
    //                 console.log("Status Code:" +  response.statusCode);
    //             }
    //         }
    //     })
    //     .catch(function(err){
    //         console.log("error occured in promise");
    //     })
//}

getAtcoderRate("yoyoyousei").then(function(res){console.log(res)})