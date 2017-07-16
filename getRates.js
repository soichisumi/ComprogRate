let chr = require("cheerio-httpcli")


//
function getAtcoderRate(userId){
    //このpromiseから現在のレートが帰る
    return new Promise(function(resolve, reject){
            console.log("in function.")

            chr.fetch('https://atcoder.jp/user/' + userId)
                .then(function(res){
                    let $ = res.$;
                    let nowRate = $('dd').eq(5).text()
                    let maxRate = $('dd').eq(6).text()
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