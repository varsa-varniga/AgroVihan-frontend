import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import axios from "axios";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use port 5002 instead of 5000
        const response = await axios.get(API_ENDPOINTS.WEATHER);
        setWeather(response.data);
      } catch (error) {
        console.log("Error fetching weather:", error);
        setError("Failed to load weather data");
        // Fallback mock data
        setWeather({
          temp: 28,
          humidity: 65,
          description: "clear sky",
          rain: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <span className="ml-2">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 shadow-lg">
        <div className="text-center">
          <p>⚠️ Weather data unavailable</p>
          <p className="text-sm opacity-80">Using default values</p>
        </div>
      </div>
    );
  }

  const getWeatherEmoji = (desc) => {
    if (desc.includes("rain")) return "🌧️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("clear")) return "☀️";
    if (desc.includes("sunny")) return "☀️";
    return "🌤️";
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Current Weather</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl">
              {getWeatherEmoji(weather.description)}
            </span>
            <span className="text-xl font-bold">
              {Math.round(weather.temp)}°C
            </span>
          </div>
          <p className="text-blue-100 capitalize">{weather.description}</p>
          {error && (
            <p className="text-xs text-yellow-200 mt-1">⚠️ Using cached data</p>
          )}
        </div>
        <div className="text-right">
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌧️ Rain: {weather.rain}mm</p>
          <p className="text-xs text-blue-200 mt-1">
            {weather.source === "fallback" ? "Demo Data" : "Live Data"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
