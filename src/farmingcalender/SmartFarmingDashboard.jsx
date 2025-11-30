import React, { useState, useEffect } from "react";
import axios from "axios";
import CropDetectionInterface from "./components/CropDetectionInterface";
import WeatherWidget from "./components/WeatherWidget";

const SmartFarmingAssistant = () => {
  const [tasks, setTasks] = useState([]);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log("Error loading tasks:", error);
    }
  };

  const handleTasksGenerated = () => {
    loadTasks(); // Refresh tasks when AI generates new ones
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          🌾 Smart Farming Assistant
        </h1>
        <p className="text-gray-600">
          AI-Powered Crop Detection & Farming Recommendations
        </p>
      </div>

      {/* Weather Widget */}
      <div className="max-w-4xl mx-auto mb-6">
        <WeatherWidget />
      </div>

      {/* Main Content - Only Crop Detection */}
      <div className="max-w-6xl mx-auto">
        <CropDetectionInterface onTasksGenerated={handleTasksGenerated} />
      </div>

      {/* Summary Section */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📊 Summary of Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-700">Humidity</div>
            <div className="text-2xl font-bold text-blue-800">54%</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-700">Rain</div>
            <div className="text-2xl font-bold text-gray-800">4mm</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-700">Status</div>
            <div className="text-lg font-bold text-green-800">Live Data</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFarmingAssistant;
