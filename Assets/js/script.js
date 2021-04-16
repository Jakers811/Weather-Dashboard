$(document).ready(function () {
    const now = moment().format("M/D/YYYY");
    const APIKey = "&appid=c04d3b0e71450877c96228b5595d876b";
    const imperialStandard = "&units=imperial";
    let searchedCity = "";
    let cityIndex = 0;

    let lastCity = localStorage.getItem("lastCity");
    if (lastCity !== null) {
        searchedCity = lastCity;
        pastSearches();
        currentWeather();
        futureForecast();
    };

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();
        searchedCity = $("#searchField").val();
        pastSearches();
        currentWeather();
        futureForecast();
    });

    $("ul").on("click", "li", function (event) {
        event.preventDefault();
        searchedCity = $(this).text();
        currentWeather();
        futureForecast();

    });

    function pastSearches() {
        let historyListItem = $("<li>").attr("class", "list-group-item");
        historyListItem.text(searchedCity);
        $("#searchHistory").prepend(historyListItem);
    };

    function currentWeather() {
        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + imperialStandard + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let weatherIcon = "";
            let temp = "";
            let humidity = "";
            let windSpeed = "";
            let lat = "";
            let long = "";

            lat = response.city.coord.lat;
            long = response.city.coord.lon;
            weatherIcon = response.list[0].weather[0].icon;
            temp = response.list[0].main.temp;
            humidity = response.list[0].main.humidity;
            windSpeed = response.list[0].wind.speed;

            uvIndex(lat, long, temp, humidity, windSpeed, weatherIcon);
        });
    };

    function displayCurrentWeather(temp, humidity, windSpeed, weatherIcon, uvIndex) {
        let iconSrc = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

        switch (Math.floor(uvIndex)) {
            case 0:
            case 1:
            case 2:
                $("#currentUV").attr("style", "background-color: green; color: white;");
                break;
            case 3:
            case 4:
            case 5:
                $("#currentUV").attr("style", "background-color: yellow;");
                break;
            case 6:
            case 7:
                $("#currentUV").attr("style", "background-color: orange;");
                break;
            case 8:
            case 9:
            case 10:
                $("#currentUV").attr("style", "background-color: red; color: white;");
                break;
            default:
                $("#currentUV").css("background-color: violet;");
                break;
        };


        $("#todaysDate").text(now);
        $("#cityName").text(searchedCity);
        $("#weatherIcon").attr("src", iconSrc);
        $("#currentTemp").text(temp);
        $("#currentHumidity").text(humidity);
        $("#currentWindSpeed").text(windSpeed);
        $("#currentUV").text(uvIndex);

        localStorage.setItem("lastCity", searchedCity);

        $("#currentWeather").fadeIn(500);
    };

    function uvIndex(lat, long, temp, humidity, windSpeed, weatherIcon) {
        let queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let uvIndex = response.value;
            displayCurrentWeather(temp, humidity, windSpeed, weatherIcon, uvIndex);
        });
    };

    function futureForecast() {
        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + imperialStandard + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let results = $(response.list).slice(0, 5);

            let date = "";
            let dayOffset = 1;
            let weatherIcon = "";
            let temp = "";
            let humidity = "";

            results.each(function (index) {

                date = moment().add(index + 1, "d").format("M/D/YYYY");
                weatherIcon = response.list[index].weather[0].icon
                temp = response.list[index].main.temp;
                humidity = response.list[index].main.humidity;
                displayFutureWeather(date, weatherIcon, temp, humidity, index);
            });
            showFutureForecast();

        });

    };

    function displayFutureWeather(date, weatherIcon, temp, humidity, index) {

        let iconSrc = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

        $("#date-" + index).text(date);
        $("#weatherIcon-" + index).attr("src", iconSrc);
        $("#temp-" + index).text("Temp: " + temp);
        $("#humidity-" + index).text("Humidity: " + humidity);

    };

    function showFutureForecast() {
        $("#futureForecast").fadeIn(500);
        $("#lastUpdatedNotice").fadeIn(500);
    };

});