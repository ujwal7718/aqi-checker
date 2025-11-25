AQI Checker – Full-Stack Assignment

A full-stack Air Quality Index Checker built with React (frontend) and Spring Boot (backend).
It fetches real-time AQI using the WAQI API and includes an intelligent caching system to speed up repeated queries — exactly as required in the assignment.

🚀 Features
Frontend (React)

Modern responsive UI
Light/Dark mode toggle
City suggestions dropdown
Animated AQI card
Loading + error indicators
Backend (Spring Boot)

REST API:
GET /api/aqi?city={cityName}
WAQI API integration
In-memory caching (5-minute expiry)
Faster repeated queries
Environment variable support using .env

📦 Tech Stack

Frontend: React, Axios, CSS
Backend: Spring Boot, RestTemplate, Dotenv, Maven

⚙️ Backend Setup (Spring Boot)
1️⃣ Create .env file inside /backend
AQI_API_KEY=YOUR_WAQI_TOKEN

2️⃣ Install dependencies
mvn clean install

3️⃣ Run the backend
mvn spring-boot:run

API Endpoint:
http://localhost:8080/api/aqi?city=Pune

🎨 Frontend Setup (React)
1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev

App URL:
http://localhost:5173

🧠 Caching Logic
The backend uses an in-memory ConcurrentHashMap to store previous WAQI responses.
Cache Features:
Expires every 5 minutes
Returns results instantly for repeated queries
Reduces WAQI API calls
Ensures faster performance
