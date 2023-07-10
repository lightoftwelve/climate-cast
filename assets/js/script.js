// Get the current hour using Day.js
var currentHour = dayjs().hour();
// Define an array of image sources for each time period
var imageSources = [
    "./assets/images/sunrise-by-ocean.jpg",
    "./assets/images/midday-blue-sky-with-clouds.jpg",
    "./assets/images/pink-sky-sunset-by-ocean.jpg",
    "./assets/images/midnight-sky-scene.jpg"
];
// Get the image element
var weatherImage = document.getElementById("weather-image");
// Set the image source based on the current hour
if (currentHour >= 6 && currentHour < 12) {
    weatherImage.src = imageSources[0];  // Morning image
} else if (currentHour >= 12 && currentHour < 18) {
    weatherImage.src = imageSources[1];  // Afternoon image
} else if (currentHour >= 18 && currentHour < 24) {
    weatherImage.src = imageSources[2];  // Evening image
} else {
    weatherImage.src = imageSources[3];  // Night image
}

const apiKey = "0e720671e2bd7b782ffcabfb05a50af8";

// search form
$("#search-form").on("submit", function (event) {
    event.preventDefault();
    var city = $("#city-input").val();
    getWeatherData(city);
});

// Fetches the current weather data for the input city using the API and displays it. Calls getForecastData to fetch and display the forecast data. Calls addCityToHistory to add the city to the search history
function getWeatherData(city) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            getForecastData(city);
            addCityToHistory(city);
        })
        .catch(error => {
            console.log("Error fetching current weather data:", error);
        });
}

// Fetches the forecast data for the input city using the API and displays it.
function getForecastData(city) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => {
            console.log("Error fetching forecast data:", error);
        });
}

// Current Weather Forecast
function displayCurrentWeather(data) {
    $("#current-weather").empty(); // Clear previous card
    var cityName = $('<h2>').text(data.name);
    var temperature = $('<p>').text('Temperature: ' + data.main.temp + '°C');
    var wind = $('<p>').text('Wind: ' + data.wind.speed + ' °m/sec');
    var humidity = $('<p>').text('Humidity: ' + data.main.humidity + '%');

    // Retrieve current weather icon
    var weatherIconCode = data.weather[0].icon;
    var weatherIconUrl = `https://openweathermap.org/img/w/${weatherIconCode}.png`;
    var weatherIcon = $('<img>').attr('src', weatherIconUrl);

    $("#current-weather").append(cityName, weatherIcon, temperature, wind, humidity);
}

// 5-Day Forecast
function displayForecast(data) {
    $("#forecast-cards").empty(); // Clear previous cards
    var forecastData = data.list; // extracts the list property from the object containing forecast data
    var uniqueDates = Array.from(new Set(forecastData.map(day => day.dt_txt.split(" ")[0]))); // extracts the date portion of each forecast and uses set array to remove duplicate dates

    uniqueDates.slice(0, 5).forEach(date => { // limits the forecast cards to the first 5 days. Iterates each date in the uniqueDates array using forEach
        var filteredData = forecastData.filter(day => day.dt_txt.includes(date)); // filters the array to get only enteries with the current date using filter and includes on day.dt_txt
        if (filteredData.length > 0) { // dynamically creating the forecast cards with jQuery
            var forecastCard = $("<div>").addClass("card col-md-2.2");
            var cardBody = $("<div>").addClass("card-body");
            var dateElement = $("<h5>").addClass("card-title").text(date);
            var temperature = $("<p>")
                .addClass("card-text")
                .text("Temp: " + filteredData[0].main.temp + "°C");
            var wind = $("<p>")
                .addClass("card-text")
                .text("Wind: " + filteredData[0].wind.speed + " m/sec");
            var humidity = $("<p>")
                .addClass("card-text")
                .text("Humidity: " + filteredData[0].main.humidity + "%");

            // Retrieve weather icon for the forecast
            var weatherIconCode = filteredData[0].weather[0].icon;
            var weatherIconUrl = `https://openweathermap.org/img/w/${weatherIconCode}.png`;
            var weatherIcon = $("<img>").attr("src", weatherIconUrl);

            cardBody.append(dateElement, weatherIcon, temperature, wind, humidity);
            forecastCard.append(cardBody);
            $("#forecast-cards").append(forecastCard); // appends the card elements
        }
    });
}

// Adds the searched city to the search history
function addCityToHistory(city) {
    // Check if the city is already in the search history
    var isCityInHistory = false;
    $('#search-history > div > span').each(function () { // selects all span elements within elements that are direct children of the search-history id
        if ($(this).text() === city) { // checks if the text in the loop matches the city variable
            isCityInHistory = true;
            return false;  // break the loop
        }
    });

    // Only add the city if it's not in the search history
    if (!isCityInHistory) {
        var cityItem = $('<div>').addClass('list-group-item list-group-item-action d-flex justify-content-between align-items-center');
        var cityName = $('<span>').text(city);
        var deleteButton = $('<button>').addClass('btn btn-link delete-button').html('<span class="material-icons">delete</span>');

        cityItem.append(cityName, deleteButton);
        $('#search-history').append(cityItem);

        // After the city has been added and all the event listeners are setup, store the city in localStorage
        localStorage.setItem(city, city);

        deleteButton.on('click', function () {
            cityItem.remove();
            localStorage.removeItem(city);
        });

        cityItem.on('click', function () {
            getWeatherData(city);
        });
    }
}

// loads localStorage first
$(document).ready(function () {
    for (var i = 0; i < localStorage.length; i++) {
        var city = localStorage.getItem(localStorage.key(i));
        addCityToHistory(city);
    }
});