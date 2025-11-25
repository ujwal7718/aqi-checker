import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CircleGauge from "./components/CircleGauge";

function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

 
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const fetchAQI = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/aqi?city=${city}`);
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch AQI data.");
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { color: "green", label: "Good" };
    if (aqi <= 100) return { color: "yellow", label: "Moderate" };
    if (aqi <= 150) return { color: "orange", label: "Unhealthy (Sensitive)" };
    if (aqi <= 200) return { color: "red", label: "Unhealthy" };
    return { color: "purple", label: "Hazardous" };
  };

  const getGradient = (color) => {
    return {
      green: "linear-gradient(135deg, #a8ff78, #78ffd6)",
      yellow: "linear-gradient(135deg, #fddb92, #d1fdff)",
      orange: "linear-gradient(135deg, #f6d365, #fda085)",
      red: "linear-gradient(135deg, #ff758c, #ff7eb3)",
      purple: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    }[color];
  };

  const cities = [
    "Delhi",
    "Mumbai",
    "Pune",
    "Chennai",
    "Bangalore",
    "Hyderabad",
    "Kolkata",
    "Ahmedabad",
    "Jaipur",
    "Surat",
  ];

  return (
    <div className="container">

      <h1>AQI Checker</h1>

      <div className="top-controls">
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="search-wrapper">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchAQI}>Search</button>
        </div>

        {city.length > 0 && (
          <div className="suggestions">
            {cities
              .filter((c) => c.toLowerCase().startsWith(city.toLowerCase()))
              .map((c) => (
                <div
                  key={c}
                  className="suggestion-item"
                  onClick={() => setCity(c)}
                >
                  {c}
                </div>
              ))}
          </div>
        )}
      </div>

      {loading && <div className="loader"></div>}

      {error && <p className="error">{error}</p>}

      {data && !data.error && (
        <div
          className="card"
          style={{
            background: getGradient(getAQIColor(data.aqi).color),
            borderColor: getAQIColor(data.aqi).color,
          }}
        >
          <span className="badge" style={{ background: getAQIColor(data.aqi).color }}>
            {getAQIColor(data.aqi).label}
          </span>

          <h2>{data.stationCity || data.requestedCity}</h2>

          <CircleGauge value={data.aqi} />

          <p className="info-line">
            <strong>PM2.5:</strong>{" "}
            {typeof data.pm25 === "object" ? data.pm25?.v : data.pm25 ?? "N/A"}
          </p>

          <p className="info-line">
            <strong>PM10:</strong>{" "}
            {typeof data.pm10 === "object" ? data.pm10?.v : data.pm10 ?? "N/A"}
          </p>

          <p className="info-line">
            <strong>Updated:</strong> {new Date(data.time).toLocaleString()}
          </p>
        </div>
      )}

      {data?.error && <p className="error">{data.error}</p>}
    </div>
  );
}

export default App;
