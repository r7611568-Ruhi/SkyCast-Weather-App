
import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/search")
def search_locations():
    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({"error": "Please enter a city, town, or village."}), 400

    try:
        response = requests.get(
            GEOCODING_URL,
            params={
                "name": city,
                "count": 10,
                "language": "en",
                "format": "json"
            },
            timeout=15
        )
        response.raise_for_status()
        results = response.json().get("results", [])

        locations = [
            {
                "name": item.get("name", ""),
                "admin": item.get("admin1", ""),
                "country": item.get("country", ""),
                "latitude": item["latitude"],
                "longitude": item["longitude"]
            }
            for item in results
        ]

        return jsonify({"locations": locations})

    except requests.RequestException:
        return jsonify({
            "error": "Unable to search locations. Check your internet connection."
        }), 502


@app.route("/api/weather")
def get_weather():
    city = request.args.get("city", "").strip()
    lat = request.args.get("lat", type=float)
    lon = request.args.get("lon", type=float)

    try:
        if lat is not None and lon is not None:
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                return jsonify({"error": "Invalid location coordinates."}), 400

            place = {
                "name": city or "Selected location",
                "admin": "",
                "country": "",
                "latitude": lat,
                "longitude": lon
            }

        else:
            if not city:
                return jsonify({
                    "error": "Enter a city or select a location."
                }), 400

            geo = requests.get(
                GEOCODING_URL,
                params={
                    "name": city,
                    "count": 10,
                    "language": "en",
                    "format": "json"
                },
                timeout=15
            )
            geo.raise_for_status()
            results = geo.json().get("results", [])

            if not results:
                return jsonify({
                    "error": "Location not found. Try another spelling."
                }), 404

            match = next(
                (
                    item for item in results
                    if item.get("name", "").casefold() == city.casefold()
                ),
                results[0]
            )

            place = {
                "name": match.get("name", city),
                "admin": match.get("admin1", ""),
                "country": match.get("country", ""),
                "latitude": match["latitude"],
                "longitude": match["longitude"]
            }

        response = requests.get(
            WEATHER_URL,
            params={
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "current": (
                    "temperature_2m,relative_humidity_2m,"
                    "apparent_temperature,is_day,precipitation,"
                    "weather_code,cloud_cover,pressure_msl,"
                    "wind_speed_10m,wind_direction_10m"
                ),
                "hourly": (
                    "temperature_2m,precipitation_probability,weather_code"
                ),
                "daily": (
                    "weather_code,temperature_2m_max,temperature_2m_min,"
                    "sunrise,sunset,uv_index_max,"
                    "precipitation_probability_max"
                ),
                "timezone": "auto",
                "forecast_days": 5
            },
            timeout=20
        )
        response.raise_for_status()
        weather = response.json()

        return jsonify({
            "location": {
                "name": place["name"],
                "admin": place["admin"],
                "country": place["country"],
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "timezone": weather.get("timezone", "")
            },
            "weather": weather
        })

    except requests.Timeout:
        return jsonify({
            "error": "Weather request timed out. Please try again."
        }), 504

    except requests.RequestException:
        return jsonify({
            "error": "Unable to get weather data. Check your internet connection."
        }), 502


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
