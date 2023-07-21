<!DOCTYPE html>
<html lang="en">


<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>休閒農場住宿資訊查詢</title>
    <script src="https://code.jquery.com/jquery-3.6.3.min.js"></script>
    <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <!-- <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> -->

</head>
<style>
    #map {
        height: 400px
    }
</style>
<script>
    //https://data.gov.tw/dataset/6413
    //step 1. get "Name",  "Address","Tel", "HostWords",  "OpenHours","City": "臺南市",
    //"Town": "大內區","Latitude" "Longitude"
    // Object.prototype.geoLocation = function (location) {
    //     let lng = parseFloat(this.Longitude).toFixed(3)
    //     let lat = parseFloat(this.Latitude).toFixed(3)
    //     location(lng, lat)
    // }
    function googlemap(lng, lat, Name, City, Town) {

        const taiwan = { lat: 23.975126479012527, lng: 120.9795655805013 };

        const map = new google.maps.Map($('#map').get(0), {
            zoom: 7,
            center: taiwan,
            mapId: '181c319e50bd5af7'
        });


        const pinViewScaled = new google.maps.marker.PinView({
            scale: 1.2,
            background: 'aqua'

        });


        const marker = new google.maps.marker.AdvancedMarkerView({
            position: { lng: lng, lat: lat },
            map: map,
            title: Name + '-' + City + '-' + Town,
            // label: record.aqi
            content: pinViewScaled.element,
        });
        

    }
    // function initMap() {
    //     const taiwan = { lat: 23.975126479012527, lng: 120.9795655805013 };

    //     const map = new google.maps.Map($('#map').get(0), {
    //         zoom: 7,
    //         center: taiwan,
    //         mapId: '181c319e50bd5af7'
    //     });

    // }
    function total(count) {
        document.getElementById('divCount').innerHTML = `<div id="divCount">共有<b>${count}</b>個地點</div>`
    }
    function alert1(count, countEnd, jsonObj) {

        if (count === 0 && countEnd === jsonObj.length) {

            setTimeout("alert('關鍵字有誤，請重新輸入')", 300)
        }
    }
    function fetch1(searchStr) {
        fetch('https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelStay.aspx')

            .then(function (response) {
                return response.text()
            })
            .then(function (text) {
                f1(text, searchStr)
                // document.getElementById('data').innerHTML = table

            })
    }
    function f1(json, searchStr) {
        let jsonObj = JSON.parse(json)
        // console.log(jsonObj.length)
        let count = 0;// count tehe success find
        let countEnd = 0 //count foreach times
        let table_header = `
   <table border="2" >
       <tr >
           
           <th ALIGN="center">民宿名字</th>
           <th ALIGN="center">地址</th>
           <th ALIGN="center">城市</th>
           <th ALIGN="center">鄉鎮</th>
           <th ALIGN="center">經度</th>
           <th ALIGN="center">緯度</th>
       </tr>
   `
        let content = ''
        // window.initMap = initMap;
       let looon = ''
        jsonObj.forEach(function (index) {
            countEnd++;

            if (index['City'].indexOf(searchStr) !== -1 && searchStr.length !== 0) {
                count++;
                looon += index.Longitude;
                let lng = parseFloat(parseFloat(index.Longitude).toFixed(3))
                let lat = parseFloat(parseFloat(index.Latitude).toFixed(3))

                content += `
           <tr>
               <td ALIGN="center">${index['Name']}</td>
               <td ALIGN="center">${index['Address']}</td>
               <td ALIGN="center">${index['City']}</td>
               <td ALIGN="center">${index['Town']}</td>
                <td ALIGN="center">${lng}</td>
               <td ALIGN="center">${lat}</td>
            </tr>
            
            <tr><td ALIGN="center"><b>電話</b></td>
                <td colspan="6" ALIGN="left">${index['Tel']}</td></tr>
            <tr><td ALIGN="center"><b>營業時間</b></td>
                <td colspan="6" ALIGN="left">${index['OpenHours']}</td></tr>
                <tr><td ALIGN="center"><b>網站首頁</b></td>
                <td colspan="6" ALIGN="left"><a href="${index['Url']}" target="_blank">${index['Url']}</a></td></tr>

            <tr><td colspan="6" ALIGN="left">${index['HostWords']}</td></tr>
            <tr><td colspan="6" ALIGN="center"><img src="${index['Photo']}"></td></tr>
       `

                total(count)
                googlemap(lng, lat, index.Name, index.City, index.Town )

            } else if (count === 0 && countEnd === jsonObj.length) {
                content = `
                        <tr>
                            <td ALIGN="center">Null</td>
                            <td ALIGN="center">Null</td>
                            <td ALIGN="center">Null</td>
                            <td ALIGN="center">Null</td>
                            <td ALIGN="center">Null</td>
                            <td ALIGN="center">Null</td>
                        </tr>
                            
                        <tr><td ALIGN="center"><b>電話</b></td>
                            <td colspan="6" ALIGN="left">Null</td></tr>
                        <tr><td ALIGN="center"><b>營業時間</b></td>
                            <td colspan="6" ALIGN="left">Null</td></tr>
                        <tr><td ALIGN="center"><b>網站首頁</b></td>
                            <td colspan="6" ALIGN="left">Null</a></td></tr>
                            <tr><td colspan="6" ALIGN="left">Null</td></tr>
                            <tr><td colspan="6" ALIGN="center">Null</td></tr>
                        
                        `
                total(count)
            }

        }
        )
        console.log(looon)
        let table_footer = '</table>'
        let table = table_header + content + table_footer
        document.getElementById('data').innerHTML = table
        // console.log(jsonObj.length)
        alert1(count, countEnd, jsonObj)

        // setTimeout(alert1(count, countEnd, jsonObj),30000)
    }

    // return table


    window.onload = function () {

        document.getElementById('button').onclick = function () {

            let searchStr = document.getElementById('search').value.trim()
            // console.log(searchStr.length)
            fetch1(searchStr)
        }
    }
</script>

<body>
    <!-- <a href="google" target="_blank"></a> -->
    <div id="map"></div>
    <br>
    <input id="search" placeholder="請輸入縣市名稱">
    <p></p>
    <button id="button">Search</button>
    <p></p>
    <div id="divCount"><b></b></div>
    <p></p>
    <div id="data"></div>

</body>
<script src="" id="Mapscr" defer></script>
<!-- defer -->
<script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACZf5z35sct2ozaLcGM0H7ZTNwtCVIads&callback=initMap&v=beta&libraries=marker"
    defer></script>

</html>
