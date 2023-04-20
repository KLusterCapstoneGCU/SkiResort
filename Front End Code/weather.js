// Select elements from the DOM
const iconElement = document.querySelector(".weather-icon"); // The icon element that shows the weather icon
const tempElement = document.querySelector(".temperature-value p"); // The temperature element that shows the temperature
const descElement = document.querySelector(".temperature-description p"); // The description element that shows the weather description
const locationElement = document.querySelector(".location p"); // The location element that shows the city and country
const notificationElement = document.querySelector(".notification"); // The notification element that shows error messages

// Weather data object
const weather = {};

// Temperature unit and default value
weather.temperature = {
    unit : "celsius"
}

// Constants and variables
const KELVIN = 273; // The Kelvin temperature unit
const key = "726771383d7bb461694c50ec2c01ceba"; // API key

// Check if the browser supports geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// Set the user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// Show error when there is an issue with geolocation
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get weather data from API
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    // Fetch weather data from API
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            // Set weather data to object properties
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            // Display weather data on the page
            displayWeather();
        });
}

// Display weather data on the page
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// When user clicks on the temperature element, convert the temperature unit
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});
