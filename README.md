# SkyCast – Weather Information App

## Project Description

SkyCast is a Python-based web application developed as part of my Python Development Internship at Auspify Technologies. It allows users to search for a city and view its weather information through a simple and user-friendly interface.

The application uses the Open-Meteo API to retrieve weather data and presents the information in an easy-to-understand format.

## Features

- Search for weather information by city.
- Display current weather conditions.
- View temperature and weather details.
- Switch between Celsius and Fahrenheit.
- View a five-day weather forecast.
- User-friendly interface.
- Web-based application accessible through a browser.

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- Open-Meteo API
- Gunicorn
- Render

## Project Links

- **GitHub Repository:** https://github.com/r7611568-Ruhi/SkyCast-Weather-App
- **Live Website:** https://skycast-weather-app-2-7hiv.onrender.com

## Project Structure

```text
SkyCast-Weather-App/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
│   └── index.html
└── static/
    ├── style.css
    ├── script.js
    └── manifest.json
```

## Requirements

- Python 3
- Flask
- Requests
- Gunicorn
- A web browser
- Internet connection

## How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/r7611568-Ruhi/SkyCast-Weather-App.git
```

### 2. Open the Project Folder

```bash
cd SkyCast-Weather-App
```

### 3. Create a Virtual Environment (Optional)

```bash
python3 -m venv .venv
```

### 4. Activate the Virtual Environment

For macOS or Linux:

```bash
source .venv/bin/activate
```

### 5. Install Dependencies

```bash
python3 -m pip install -r requirements.txt
```

### 6. Run the Application

```bash
python3 app.py
```

### 7. Open the Application

Open the local URL displayed in the terminal in your web browser. For example:

`http://127.0.0.1:5001/`

The port may vary depending on your application configuration.

## Deployment

The SkyCast Weather Information App is deployed using Render.

**Live Demo:** https://skycast-weather-app-2-7hiv.onrender.com

## Internship Details

- **Organization:** Auspify Technologies
- **Internship:** Python Development Internship
- **Project:** Task 4 – Weather Information App
- **Application Name:** SkyCast

## Conclusion

SkyCast demonstrates the use of Python, Flask, HTML, CSS, JavaScript, and a weather API to develop a web-based weather information application. This project provided practical experience in web development, API integration, and deploying an application online.
