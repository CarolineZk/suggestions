// Call Ajax
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + ' ' + req.statusText + ' ' + url);
        }
    });
    req.addEventListener('error', function () {
        console.error('Network error ' + url);
    });
    req.send(null);
}

// Set vars
var resultsVal = document.getElementById('resultsCt');
var resultsTableVal = document.getElementById('resultsTable');
var totalVal = document.getElementById('totalCt');
var cityVal = document.getElementById('city');
var cityReq = '';
var pageNb = 1;
var itemsNb = 15;

// Display prev/next buttons
function btnOn() {
    document.getElementById('previousBtn').classList.remove('btn--dis');
    document.getElementById('nextBtn').classList.remove('btn--dis');
}

function btnOff() {
    document.getElementById('previousBtn').classList.add('btn--dis');
    document.getElementById('nextBtn').classList.add('btn--dis');
}

// Get the data
function getData(cityReq, pageNb, itemsNb) {
    resultsTableVal.innerHTML = '';
    totalVal.innerHTML = '';

    ajaxGet('https://voobanchallenge.azurewebsites.net/suggestions?q=' + cityReq + '&pageNumber=' + pageNb + '&pageSize=' + itemsNb, function (response) {
        var obj = JSON.parse(response);
        var objTotal = obj.TotalItems;
        var pageTotal = objTotal/itemsNb;
        if (objTotal > 0) {
            for (i = 0; i < objTotal; i++) {
                if (typeof obj.Items[i] !== 'undefined') {
                    resultsTableVal.innerHTML +='<tr><td>' + obj.Items[i].Name + '</td><td>' + obj.Items[i].Latitude + '</td><td>' + obj.Items[i].Longitude + '</td><td>' + obj.Items[i].Score + '</td></tr>';
                }
            }
            resultsVal.classList.add('visible');
            totalVal.innerHTML = 'Total: ' + objTotal;
            btnOn();
        } else {
            resultsVal.classList.remove('visible');
            totalVal.innerHTML = 'No result found';
            btnOff();
        }
    });
};

// Display results after the 3rd char in the search bar
cityVal.addEventListener('keyup', function () {
    cityReq = cityVal.value;
    pageNb = 1;
    if (cityReq.length < 3) {
        resultsVal.classList.remove('visible');
        resultsTableVal.innerHTML = '';
        totalVal.innerHTML = '';
        btnOff();
    } else {
        getData(cityReq, 1, itemsNb);
        btnOn();
    }
});

// Display prev/next pages results by clicking the buttons
nextBtn.addEventListener('click', function () {
    cityReq = cityVal.value;
    getData(cityReq, ++pageNb, itemsNb);
});

previousBtn.addEventListener('click', function () {
    cityReq = cityVal.value;
    getData(cityReq, --pageNb, itemsNb);
});
