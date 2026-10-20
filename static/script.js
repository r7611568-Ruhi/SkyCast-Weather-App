
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const unitButton = document.getElementById("unitButton");
const statusText = document.getElementById("status");
const weatherSection = document.getElementById("weatherSection");

let isFahrenheit = false;
let latestWeather = null;

function weatherDescription(code) {
    const descriptions = {
        0: ["Clear sky", "☀️"],
        1: ["Mainly clear", "🌤️"],
        2: ["Partly cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Light drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy drizzle", "🌧️"],
        56: ["Freezing drizzle", "🌧️"],
        57: ["Freezing drizzle", "🌧️"],
        61: ["Light rain", "🌦️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy rain", "🌧️"],
        66: ["Freezing rain", "🌧️"],
        67: ["Freezing rain", "🌧️"],
        71: ["Light snow", "🌨️"],
        73: ["Snow", "🌨️"],
        75: ["Heavy snow", "❄️"],
        77: ["Snow grains", "❄️"],
        80: ["Rain showers", "🌦️"],
        81: ["Rain showers", "🌧️"],
        82: ["Heavy showers", "⛈️"],
        85: ["Snow showers", "🌨️"],
        86: ["Heavy snow showers", "❄️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with hail", "⛈️"],
        99: ["Thunderstorm with hail", "⛈️"]
    };

    return descriptions[code] || ["Unknown conditions", "🌡️"];
}

function temperature(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "--";
    }

    const result = isFahrenheit ? Number(value) * 9 / 5 + 32 : Number(value);
    return Math.round(result);
}

function formatTime(dateTime) {
    if (!dateTime) return "--";

    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatDay(dateString, index) {
    if (index === 0) return "Today";

    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString([], { weekday: "short" });
}

function showStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.classList.toggle("error", isError);
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showStatus("Please enter a city name.", true);
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Loading...";
    showStatus(`Getting weather for ${city}...`);

    try {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to get weather information.");
        }

        if (!data.weather || !data.weather.current) {
            throw new Error("Weather data is incomplete. Please try again.");
        }

        latestWeather = data;
        renderWeather(data);
        weatherSection.classList.remove("hidden");
        showStatus("Weather information loaded successfully.");
    } catch (error) {
        showStatus(error.message || "Something went wrong. Please try again.", true);
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
});

unitButton.addEventListener("click", () => {
    isFahrenheit = !isFahrenheit;
    unitButton.textContent = isFahrenheit ? "Switch to °C" : "Switch to °F";

    if (latestWeather) {
        renderWeather(latestWeather);
    }
});

function renderWeather(data) {
    const place = data.location;
    const weather = data.weather;
    const current = weather.current;
    const daily = weather.daily || {};

    const locationParts = [
        place.name,
        place.admin,
        place.country
    ].filter(Boolean);

    document.getElementById("locationName").textContent =
        [...new Set(locationParts)].join(", ");

    const [condition, icon] = weatherDescription(current.weather_code);

    document.getElementById("weatherIcon").textContent = icon;
    document.getElementById("condition").textContent = condition;
    document.getElementById("temperature").textContent =
        temperature(current.temperature_2m);
    document.getElementById("temperatureUnit").textContent =
        isFahrenheit ? "°F" : "°C";

    document.getElementById("feelsLike").textContent =
        `${temperature(current.apparent_temperature)}°${isFahrenheit ? "F" : "C"}`;

    document.getElementById("humidity").textContent =
        `${current.relative_humidity_2m ?? "--"}%`;

    document.getElementById("wind").textContent =
        `${current.wind_speed_10m ?? "--"} km/h`;

    document.getElementById("pressure").textContent =
        `${current.pressure_msl ?? "--"} hPa`;

    document.getElementById("clouds").textContent =
        `${current.cloud_cover ?? "--"}%`;

    document.getElementById("rain").textContent =
        `${current.precipitation ?? "--"} mm`;

    document.getElementById("sunrise").textContent =
        formatTime(daily.sunrise?.[0]);

    document.getElementById("updatedText").textContent =
        `Local time: ${formatTime(current.time)}`;

    renderForecast(daily);
}

function renderForecast(daily) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.replaceChildren();

    const dates = daily.time || [];

    dates.forEach((date, index) => {
        const [condition, icon] = weatherDescription(
            daily.weather_code?.[index]
        );

        const high = temperature(daily.temperature_2m_max?.[index]);
        const low = temperature(daily.temperature_2m_min?.[index]);

        const card = document.createElement("article");
        card.className = "forecast-day";

        const dayName = document.createElement("p");
        dayName.className = "day-name";
        dayName.textContent = formatDay(date, index);

        const dayIcon = document.createElement("div");
        dayIcon.className = "day-icon";
        dayIcon.textContent = icon;
        dayIcon.setAttribute("aria-label", condition);

        const dayCondition = document.createElement("p");
        dayCondition.className = "day-condition";
        dayCondition.textContent = condition;

        const temperatures = document.createElement("div");
        temperatures.className = "day-temperatures";

        const highText = document.createElement("span");
        highText.textContent = `${high}°`;

        const lowText = document.createElement("span");
        lowText.className = "low";
        lowText.textContent = `${low}°`;

        temperatures.append(highText, lowText);
        card.append(dayName, dayIcon, dayCondition, temperatures);
        forecastContainer.appendChild(card);
    });
}
