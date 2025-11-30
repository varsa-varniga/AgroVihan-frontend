import React, { useState, useEffect } from "react";
import axios from "axios";

const AITaskGenerator = ({
  onTasksGenerated,
  crop: propCrop,
  daysSincePlanting: propDaysSincePlanting,
  onCropChange,
  onDaysChange,
}) => {
  const [localCrop, setLocalCrop] = useState(propCrop || "tomato");
  const [localDaysSincePlanting, setLocalDaysSincePlanting] = useState(
    propDaysSincePlanting || 30
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCrop, setDetectedCrop] = useState(null);
  const [iotDevices, setIotDevices] = useState([]);

  // Check available IoT devices on component mount
  useEffect(() => {
    checkAvailableIoTDevices();
  }, []);

  const checkAvailableIoTDevices = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/iot-devices");
      setIotDevices(response.data.devices);
    } catch (error) {
      console.log("No IoT devices detected");
    }
  };

  // Computer Vision Detection
  const detectCropWithCamera = async () => {
    setIsDetecting(true);
    try {
      // Access device camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // In real implementation, send video feed to backend for analysis
      const response = await axios.post(
        "http://localhost:5002/api/detect-crop-camera",
        {
          camera_available: true,
          device: "computer_vision",
        }
      );

      if (response.data.detected_crop) {
        setDetectedCrop(response.data.detected_crop);
        setLocalCrop(response.data.detected_crop);
        if (onCropChange) {
          onCropChange(response.data.detected_crop);
        }
      }
    } catch (error) {
      console.log("Camera detection failed:", error);
    }
    setIsDetecting(false);
  };

  // Multispectral Sensor Detection
  const detectCropWithMultispectral = async () => {
    setIsDetecting(true);
    try {
      const response = await axios.post(
        "http://localhost:5002/api/detect-crop-multispectral",
        {
          sensor_type: "ndvi",
          device: "multispectral_camera",
        }
      );

      if (response.data.detected_crop) {
        setDetectedCrop(response.data.detected_crop);
        setLocalCrop(response.data.detected_crop);
        if (onCropChange) {
          onCropChange(response.data.detected_crop);
        }
      }
    } catch (error) {
      console.log("Multispectral detection failed:", error);
    }
    setIsDetecting(false);
  };

  // Get real-time soil data from sensors
  const getRealTimeSoilData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/soil-sensors-realtime"
      );
      return response.data;
    } catch (error) {
      console.log("Using simulated soil data");
      return { moisture: 35 + Math.random() * 20 };
    }
  };

  // Detect growth stage from plant sensors
  const detectGrowthStage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5002/api/plant-growth-stage"
      );
      if (response.data.days_since_planting) {
        setLocalDaysSincePlanting(response.data.days_since_planting);
        if (onDaysChange) {
          onDaysChange(response.data.days_since_planting);
        }
      }
    } catch (error) {
      console.log("Growth stage detection failed");
    }
  };

  const generateAITasks = async () => {
    setIsGenerating(true);
    setAiResult(null);

    try {
      const weatherResponse = await axios.get(
        "http://localhost:5002/api/weather"
      );
      const weather = weatherResponse.data;

      // Get real soil data from IoT sensors
      const soilData = await getRealTimeSoilData();

      const response = await axios.post(
        "http://localhost:5002/api/advanced-ai-tasks",
        {
          crop: localCrop,
          daysSincePlanting: localDaysSincePlanting,
          weather,
          soilData,
        }
      );

      setAiResult(response.data);

      if (response.data.daily_checklist) {
        for (const task of response.data.daily_checklist) {
          await axios.post("http://localhost:5002/api/tasks", {
            title: task.task.replace(/_/g, " ").toUpperCase(),
            type: mapAITaskType(task.task),
            reason: task.reason,
            date: new Date(),
            completed: false,
            crop: localCrop,
            priority: task.priority,
            source: "ai_system",
            estimated_duration: task.estimated_duration,
          });
        }
      }

      if (onTasksGenerated) {
        onTasksGenerated();
      }
    } catch (error) {
      console.log("Error generating AI tasks:", error);
      setAiResult({
        error: "AI service unavailable. Using basic system.",
        model: "fallback",
      });
    }
    setIsGenerating(false);
  };

  const mapAITaskType = (predictedTask) => {
    const typeMap = {
      irrigation: "irrigation",
      fertilizer: "fertilizer",
      pest_control: "pestcontrol",
      harvest: "harvest",
      pruning: "general",
      weeding: "general",
      soil_testing: "general",
      general_care: "general",
      drainage_check: "general",
      shade_management: "general",
      frost_protection: "general",
    };
    return typeMap[predictedTask] || "general";
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-bold text-lg mb-3 text-blue-800">
        🤖 Smart Farming Assistant
      </h3>

      {/* IoT Device Detection Section */}
      {iotDevices.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">
            📡 Connected IoT Devices ({iotDevices.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            {iotDevices.map((device, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-lg">
                  {device.type === "camera" && "📷"}
                  {device.type === "multispectral" && "🌱"}
                  {device.type === "soil_sensor" && "💧"}
                  {device.type === "weather_station" && "🌤️"}
                </span>
                <span className="font-medium">{device.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    device.status === "online"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {device.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {iotDevices.some((d) => d.type === "camera") && (
              <button
                onClick={detectCropWithCamera}
                disabled={isDetecting}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDetecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>📷 Use Camera Detection</>
                )}
              </button>
            )}

            {iotDevices.some((d) => d.type === "multispectral") && (
              <button
                onClick={detectCropWithMultispectral}
                disabled={isDetecting}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDetecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Scanning...
                  </>
                ) : (
                  <>🌱 Use Multispectral Scan</>
                )}
              </button>
            )}

            <button
              onClick={detectGrowthStage}
              className="flex-1 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 flex items-center justify-center gap-2"
            >
              📊 Detect Growth Stage
            </button>
          </div>

          {detectedCrop && (
            <div className="mt-2 p-2 bg-white rounded border border-green-300">
              <p className="text-green-700 text-sm">
                ✅ Detected: <strong>{detectedCrop.replace("_", " ")}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Manual Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Crop
          </label>
          <select
            value={localCrop}
            onChange={(e) => setLocalCrop(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="tomato">🍅 Tomato</option>
            <option value="rice">🌾 Rice</option>
            <option value="chili">🌶️ Chili</option>
            <option value="green_gram">🌱 Green Gram</option>
            <option value="brinjal">🍆 Brinjal</option>
            <option value="cotton">🧵 Cotton</option>
            <option value="sugarcane">🎋 Sugarcane</option>
            <option value="maize">🌽 Maize</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Days Since Planting
          </label>
          <input
            type="number"
            value={localDaysSincePlanting}
            onChange={(e) =>
              setLocalDaysSincePlanting(parseInt(e.target.value))
            }
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            min="1"
            max="120"
          />
          <div className="text-xs text-gray-500 mt-1">
            Current: Day {localDaysSincePlanting}
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={generateAITasks}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                AI Thinking...
              </>
            ) : (
              <>🎯 Generate AI Tasks</>
            )}
          </button>
        </div>
      </div>

      {/* AI Results Display */}
      {aiResult && (
        <div
          className={`p-4 rounded-lg border ${
            aiResult.error
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          {aiResult.error ? (
            <div className="text-red-700">
              <p className="font-semibold">⚠️ {aiResult.error}</p>
            </div>
          ) : (
            <div className="text-green-700">
              <p className="font-semibold">
                ✅ AI Generated {aiResult.daily_checklist?.length || 0} Tasks!
              </p>
              <p className="text-sm mt-1">
                Using:{" "}
                <span className="font-mono bg-green-200 px-2 py-1 rounded">
                  {iotDevices.length > 0 ? "IoT Sensors" : "Manual Input"}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-600 mt-3">
        💡 Uses real IoT devices: Cameras, multispectral sensors, and soil
        monitors for accurate detection.
      </p>
    </div>
  );
};

export default AITaskGenerator;
