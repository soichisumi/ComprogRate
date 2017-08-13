var colors = {
    'atcoder': [
        { color: '#808080', min: 0, max: 399, title: 'Gray' },
        { color: '#804000', min: 400, max: 799, title: 'Brown' },
        { color: '#008000', min: 800, max: 1199, title: 'Green' },
        { color: '#00C0C0', min: 1200, max: 1599, title: 'Cyan' },
        { color: '#0000FF', min: 1600, max: 1999, title: 'Blue' },
        { color: '#C0C000', min: 2000, max: 2399, title: 'Yellow' },
        { color: '#FF8000', min: 2400, max: 2799, title: 'Orange' },
        { color: '#FF0000', min: 2800, max: 9999, title: 'Red' }
    ],

    'codeforces': [
        { color: '#808080', min: 0, max: 1199, title: 'Newbie' },
        { color: '#008000', min: 1200, max: 1399, title: 'Pupil' },
        { color: '#03A89E', min: 1400, max: 1599, title: 'Specialist' },
        { color: '#0000FF', min: 1600, max: 1899, title: 'Expert' },
        { color: '#AA00AA', min: 1900, max: 2199, title: 'Candidate Master' },
        { color: '#AA00AA', min: 2200, max: 2299, title: 'Master' },
        { color: '#FF8C00', min: 2300, max: 2399, title: 'International Master' },
        { color: '#FF0000', min: 2400, max: 2599, title: 'Grandmaster' },
        { color: '#FF0000', min: 2600, max: 2899, title: 'International Grandmaster' },
        { color: '#FF0000', camelcolor: '#000000', min: 2900, max: 9999, title: 'Legendary Grandmaster' }
    ],
    'topcoder': [
        { color: '#999999', min: 0, max: 899, title: 'Gray' },
        { color: '#00A900', min: 900, max: 1199, title: 'Green' },
        { color: '#6666FF', min: 1200, max: 1499, title: 'Blue' },
        { color: '#DDCC00', min: 1500, max: 2199, title: 'Yellow' },
        { color: '#EE0000', min: 2200, max: 2999, title: 'Red' },
        { color: '#EE0000', camelcolor: '#000000', min: 3000, max: 9999, title: 'Target' },
    ]
};

let yqlOptions = {
    type: 'GET',
    //url: yql,
    dataType: 'json',
    timeout: 10000,
    cache: false
}

let getCodeforcesRate = (handle) => {
    let url = "http://codeforces.com/api/user.info?handles=" + handle;
    let query = "select * from json where url = '" + url + "'";
    let yql = "https://query.yahooapis.com/v1/public/yql?format=json&q=" + encodeURIComponent(query);
    let option = yqlOptions;
    option['url'] = yql
    return new Promise((resolve, reject) => {
        $.ajax(option).done(function (data) {
            if (data.query.results.json.status == "OK") {
                data = data.query.results.json.result;
                if (data != undefined) {
                    resolve({
                        nowRate: data.rating,
                        maxRate: data.maxRating,
                        titlePhoto: data.titlePhoto,
                        avater: data.avatar,
                        message: 'OK'
                    })
                } else {
                    reject({ message: 'codeforces api result is empty' })
                }
            } else {
                reject({ message: 'codeforces api not returned 200' })
            }
        }).fail(function (data) {
            reject({ message: 'codeforces api call failed' })
        });
    })
}

let getAtcoderRate = (handle) => {
    let url = "https://atcoder.jp/user/" + handle;
    let xpath = '//*[@id="main-div"]/div/div/div[2]/dl';
    let query = "select * from htmlstring where url = '" + url + "' and xpath = '" + xpath + "'";
    let yql = "https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=" + encodeURIComponent(query);
    let option = yqlOptions;
    option['url'] = yql
    return new Promise((resolve, reject) => {
        $.ajax(option).done(function (data) {
            data = data.query.results.result
            if (data != undefined) {
                resolve({
                    //eq0で順位　過去のレートが欲しい場合はscriptタグ内を解析する
                    nowRate: Number($('dd:eq(1)', data).text()),
                    maxRate: Number($('dd:eq(2)', data).text()),
                    //titlePhoto: data.titlePhoto,
                    //avater: data.avatar,
                    message: 'OK'
                })
            } else {
                reject({ message: 'somewhat happening in atcoder page' })
            }

        }).fail(function (data) {
            reject({ message: 'somewhat happening in atcoder page' })
        })
    })
}

let getTopcoderRate = (handle) => {
    return new Promise((resolve, reject) => {
        $.ajax(
            {
                type: 'GET',
                url: "https://api.topcoder.com/v2/users/" + handle + "/statistics/data/srm",
                dataType: 'json',
                timeout: 10000,
                cache: false,
            }).done((data) => {
                resolve({ nowRate: parseInt(data.rating), maxRate: parseInt(data.maximumRating), message: 'OK' })
            }).fail((data) => {
                reject({ message: 'topcoder api call failed' })
            });
    })
}

let getHtmlForRate = (contest, name, rate) => {
    for (let i = 0; i < colors[contest].length; i++) {
        if (rate <= colors[contest][i].max)
            return '<div style="font-weight:bold;color:' + colors[contest][i].color + '">' + name + ' (' + rate + ')' + '</div>'
    }
}
getAtcoderRate('yoyoyousei').then((data) => { $('#atc').html(getHtmlForRate('atcoder', 'yoyoyousei', data.maxRate)) })
getCodeforcesRate('Yousei').then((data) => { $('#cdf').html(getHtmlForRate('codeforces', 'Yousei', data.maxRate)) })
getTopcoderRate('SoichiSumi').then((data) => { $('#tpc').html(getHtmlForRate('topcoder', 'SoichiSumi', data.maxRate)) })
