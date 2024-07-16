const apikey = "1d9f78e30b2044005ce9938e00c57fb2";
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const url = (city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
async function getWeatherByLocation(city) {
    const resp = await fetch(url(city), {
        origin: "cors"
    });
    const respData = await resp.json();
    console.log(respData);
    addWeatherToPage(respData);
    updateBackground(respData.weather[0].main);
}

function updateBackground(weatherCondition) {
    const body = document.body;
    let backgroundImage;

    switch (weatherCondition) {
        case "Clear":
            backgroundImage = "url('https://cdn.romania-insider.com/sites/default/files/styles/article_large_image/public/featured_images/sunny-sxc.jpg')";
            break;
        case "Clouds":
            backgroundImage = "url('https://i.pinimg.com/originals/32/19/b5/3219b5bacd3c712241660b5465785e8c.jpg')";
            break;
        case "Rain":
            backgroundImage = "url('https://c4.wallpaperflare.com/wallpaper/626/350/495/rain-drops-splashes-heavy-rain-wallpaper-preview.jpg')";
            break;
        case "Error":
            backgroundImage = "url('https://cdn.wallpapersafari.com/54/14/TRu7bW.jpg')";
            break;
        default:
            backgroundImage = "url('https://cdn.wallpapersafari.com/35/15/e35Vwz.jpg')";
            break;
    }

    body.style.backgroundImage = backgroundImage;
}

async function addWeatherToPage(data) {
    const temp = KtoC(data.main.temp);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const weather = document.createElement("div");
    weather.classList.add("weather");

    weather.innerHTML = `
    <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
    <small>${data.weather[0].main}</small>
    <div class="more-info">
      <p>Humidity : <span>${humidity}%</span></p>
      <p>Wind speed : <span>${+Math.trunc(windSpeed * 3.16)}km/h</span></p>
    </div>
  `;

    main.innerHTML = "";
    main.appendChild(weather);
}

function KtoC(K) {
    return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = search.value;
    if (city) {
        getWeatherByLocation(city);
    }
});

function displayErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
}

async function getWeatherByLocation(city) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "";
    const resp = await fetch(url(city), {
        origin: "cors"
    });

    if (resp.status !== 200) {
        main.innerHTML = "";
        displayErrorMessage("Location not found. Please enter a correct area.");
        updateBackground("Error");
        return;
    }
    const respData = await resp.json();
    console.log(respData);
    main.innerHTML = "";
    addWeatherToPage(respData);
    updateBackground(respData.weather[0].main);
}