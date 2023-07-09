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