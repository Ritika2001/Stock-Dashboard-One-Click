var today = new Date()
var oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
today = today.toISOString().split('T')[0];
oneMonthAgo = oneMonthAgo.toISOString().split('T')[0];
document.getElementById('enddate').value = today;
document.getElementById('startdate').setAttribute('max', today);
document.getElementById('startdate').value = oneMonthAgo;
document.getElementById('enddate').setAttribute('max', today);


async function callback() {
    let Stock = document.getElementById('stock').value;
    let StartDate = document.getElementById('startdate').value;
    let EndDate = document.getElementById('enddate').value;
    response = await fetch("/display/getInfo?stock=" + Stock);    
    if (response.ok) {
        let infoJson = await response.json();
        info(infoJson);
        let response_close = await fetch("/display/getClose?stock=" + Stock + "&startdate=" + StartDate + "&enddate=" + EndDate);
        let response_volume = await fetch("/display/getVolume?stock=" + Stock + "&startdate=" + StartDate + "&enddate=" + EndDate);
        let response_news = await fetch("/display/getNews?stock=" + Stock);
        if (response_close.ok && response_volume.ok) {
            let chartJsonClose = await response_close.json();
            let chartJsonVolume = await response_volume.json();
            Plotly.newPlot('line-chart-close', chartJsonClose, {});
            Plotly.newPlot('line-chart-volume', chartJsonVolume, {});            
        } else {
            alert("HTTP-Error: " + response.status + "on getCharts");
        }
        if (response_news.ok) {
            let jsonNews = await response_news.json();
            console.log(jsonNews[0].headline);
            compNews(jsonNews);   
        }       
    } else {
        alert("If a you tried a new company that doesn't exist in our database, please give it a minute due to api call limitations or the api call does not support this company.");
    }
}
function info(json) {
    let name = document.getElementById('sector');
    name.innerHTML = json.sector;
    name = document.getElementById('fullname');
    name.innerHTML = json.longName;
    name = document.getElementById('roi');
    name.innerHTML = json.ROI;
    name = document.getElementById('roa');
    name.innerHTML = json.ROA;
    name = document.getElementById('roe');
    name.innerHTML = json.ROE;
    name = document.getElementById('industry');
    name.innerHTML = json.industry;
    name = document.getElementById('ceo');
    name.innerHTML = json.CEO;
    name = document.getElementById('website');
    name.innerHTML = '<a href="' + json.website + '" target="_blank">' + json.website + '</a>';
    name = document.getElementById('summary');
    name.innerHTML = json.longBusinessSummary;
    name = document.getElementById('address');
    name.innerHTML = json.address1 + "<br>" + json.city + ", " + json.state +
        " " + json.zip + "<br>" + json.country;
}
function compNews(json) {
    for(var i = 0; i < json.length; i += 1) {
        let element = document.getElementById('head' + String(i+1));
        element.innerHTML = json[i].headline;
        element.href = json[i].url;
        element = document.getElementById('time' + String(i+1));
        element.innerHTML = json[i].datetime;
        element = document.getElementById('sum' + String(i+1));
        element.innerHTML = json[i].summary;
        element = document.getElementById('img' + String(i+1));
        element.src = json[i].image;
    }
}