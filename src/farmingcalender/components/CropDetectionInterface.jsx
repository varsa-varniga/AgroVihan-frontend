import React, { useState, useEffect } from "react";
import axios from "axios";
import WeeklyPlanner from "./WeeklyPlanView";
import { API_ENDPOINTS } from "../config/api";

const CropDetectionInterface = ({ onTasksGenerated }) => {
  const [activeTab, setActiveTab] = useState("image"); // 'image' or 'manual'
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);

  // Manual input state
  const [manualCrop, setManualCrop] = useState("tomato");
  const [manualDays, setManualDays] = useState(30);
  const [manualResult, setManualResult] = useState(null);

  // Debug useEffect
  useEffect(() => {
    console.log("🔄 Weekly Plan State Updated:", weeklyPlan);
    console.log("👀 Show Weekly Plan:", showWeeklyPlan);

    if (weeklyPlan) {
      console.log("📊 Weekly Plan Structure:", {
        hasDailyPlans: !!weeklyPlan.daily_plans,
        dailyPlansCount: Object.keys(weeklyPlan.daily_plans || {}).length,
        dailyPlans: weeklyPlan.daily_plans,
        weekSummary: weeklyPlan.week_summary,
        crop: weeklyPlan.crop,
        current_stage: weeklyPlan.current_stage,
      });
    }
  }, [weeklyPlan, showWeeklyPlan]);

  // Enhanced detection handler with weekly planning
  const handleEnhancedDetection = async (result) => {
    if (result.success) {
      try {
        const cropInfo = {
          detected_crop: result.detected_crop || result.crop,
          growth_stage: result.growth_stage,
          days_estimate: result.days_estimate || result.days_since_planting,
        };

        console.log("🌱 Sending crop info for weekly planning:", cropInfo);

        // Use the correct endpoint
        const response = await axios.post(
          "http://localhost:5002/api/detect-and-plan",
          {
            crop: cropInfo.detected_crop,
            growth_stage: cropInfo.growth_stage,
            daysSincePlanting: cropInfo.days_estimate,
          }
        );

        console.log("✅ Weekly plan response:", response.data);

        if (response.data.success) {
          setWeeklyPlan(response.data.weekly_plan);
          setShowWeeklyPlan(true);

          if (onTasksGenerated) {
            onTasksGenerated({
              daily_checklist: response.data.today_tasks,
              pending_tasks: response.data.pending_tasks,
              weekly_plan: response.data.weekly_plan,
            });
          }
        }
      } catch (error) {
        console.error("❌ Error getting enhanced plan:", error);
        // Fallback to basic detection
        setWeeklyPlan(null);
        setShowWeeklyPlan(false);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        analyzeImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData) => {
    setIsProcessing(true);
    setDetectionResult(null);
    setWeeklyPlan(null);
    setShowWeeklyPlan(false);

    try {
      const response = await axios.post(
        "http://localhost:5002/api/detect-crop",
        {
          image: imageData,
        }
      );

      setDetectionResult(response.data);

      // Call enhanced detection after basic detection
      if (response.data.success) {
        await handleEnhancedDetection(response.data);
      }

      if (response.data.success && onTasksGenerated) {
        onTasksGenerated(response.data.ai_tasks);
      }
    } catch (error) {
      console.error("Detection error:", error);
      setDetectionResult({
        success: false,
        error:
          "Failed to analyze image. Make sure backend is running on port 5002.",
      });
    }
    setIsProcessing(false);
  };

  const handleManualSubmit = async () => {
    setIsProcessing(true);
    setManualResult(null);
    setWeeklyPlan(null);
    setShowWeeklyPlan(false);

    try {
      const response = await axios.post(
        "http://localhost:5002/api/manual-input",
        {
          crop: manualCrop,
          daysSincePlanting: manualDays,
        }
      );

      setManualResult(response.data);

      // Call enhanced detection after manual input
      if (response.data.success) {
        await handleEnhancedDetection(response.data);
      }

      if (response.data.success && onTasksGenerated) {
        onTasksGenerated(response.data.ai_tasks);
      }
    } catch (error) {
      console.error("Manual input error:", error);
      setManualResult({
        success: false,
        error:
          "Failed to process manual input. Make sure backend is running on port 5002.",
      });
    }
    setIsProcessing(false);
  };

  const getStageColor = (stage) => {
    const colors = {
      germination: "bg-blue-100 text-blue-800 border-blue-300",
      seedling: "bg-green-100 text-green-800 border-green-300",
      vegetative: "bg-emerald-100 text-emerald-800 border-emerald-300",
      flowering: "bg-purple-100 text-purple-800 border-purple-300",
      fruiting: "bg-orange-100 text-orange-800 border-orange-300",
      harvest: "bg-red-100 text-red-800 border-red-300",
      tillering: "bg-teal-100 text-teal-800 border-teal-300",
      ripening: "bg-amber-100 text-amber-800 border-amber-300",
    };
    return colors[stage] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getCropEmoji = (crop) => {
    const emojis = {
      tomato: "🍅",
      rice: "🌾",
      chili: "🌶️",
      green_gram: "🌱",
      brinjal: "🍆",
      cotton: "🧵",
      sugarcane: "🎋",
      maize: "🌽",
    };
    return emojis[crop] || "🌱";
  };

  // Task update handler
  const handleTaskUpdate = (action, task, date, reason) => {
    console.log(`Task ${action}:`, task, date, reason);

    if (action === "completed") {
      // Task completed - update state or send to backend
      console.log("✅ Task completed:", task.task);
      // You can add API call here to update task status
    } else if (action === "postponed") {
      // Task postponed - will be carried over to next day
      console.log("⏸️ Task postponed:", task.task, "Reason:", reason);
      // You can add API call here to postpone task
    }
  };

  // Render detection results
  const renderDetectionResults = () => {
    if (!detectionResult) return null;

    if (!detectionResult.success) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">
            Error: {detectionResult.error}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Detection Summary */}
        <div
          className={`p-4 rounded-lg border-2 ${getStageColor(
            detectionResult.growth_stage
          )}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">
              {getCropEmoji(detectionResult.detected_crop)}
            </span>
            <div>
              <h3 className="font-bold text-lg">{detectionResult.crop_name}</h3>
              <p className="text-sm font-medium">
                {detectionResult.growth_stage.replace("_", " ").toUpperCase()}{" "}
                Stage
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Estimated Days:</span>{" "}
              {detectionResult.days_estimate}
            </div>
            <div>
              <span className="font-medium">Confidence:</span>{" "}
              {detectionResult.confidence?.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-semibold text-lg mb-3">💡 Recommendations</h4>
          <ul className="space-y-2">
            {detectionResult.recommendations?.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm bg-white p-3 rounded-lg border"
              >
                <span className="text-green-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Generated Tasks */}
        {detectionResult.ai_tasks && (
          <div>
            <h4 className="font-semibold text-lg mb-3">
              🤖 Today's AI Suggested Tasks
            </h4>
            <div className="space-y-3">
              {detectionResult.ai_tasks.daily_checklist
                ?.slice(0, 3)
                .map((task, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-lg">
                        {task.task.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600">{task.reason}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Duration: ~{task.estimated_duration}h
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Weekly Plan Toggle */}
        {weeklyPlan && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {showWeeklyPlan
                ? "📅 Hide Weekly Plan"
                : "📅 Show 7-Day Farming Plan"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render manual results
  const renderManualResults = () => {
    if (!manualResult) return null;

    if (!manualResult.success) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">
            Error: {manualResult.error}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Crop Info */}
        <div
          className={`p-4 rounded-lg border-2 ${getStageColor(
            manualResult.growth_stage
          )}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getCropEmoji(manualResult.crop)}</span>
            <div>
              <h3 className="font-bold text-lg capitalize">
                {manualResult.crop.replace("_", " ")}
              </h3>
              <p className="text-sm font-medium capitalize">
                {manualResult.growth_stage.replace("_", " ")} Stage
              </p>
              <p className="text-sm">Day {manualResult.days_since_planting}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-semibold text-lg mb-3">
            💡 Expert Recommendations
          </h4>
          <ul className="space-y-2">
            {manualResult.recommendations?.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm bg-white p-3 rounded-lg border"
              >
                <span className="text-green-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Tasks */}
        {manualResult.ai_tasks && (
          <div>
            <h4 className="font-semibold text-lg mb-3">🤖 Today's Tasks</h4>
            <div className="space-y-3">
              {manualResult.ai_tasks.daily_checklist
                ?.slice(0, 4)
                .map((task, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-lg">
                        {task.task.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600">{task.reason}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Duration: ~{task.estimated_duration}h
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Weekly Plan Toggle */}
        {weeklyPlan && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {showWeeklyPlan
                ? "📅 Hide Weekly Plan"
                : "📅 Show 7-Day Farming Plan"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          🌾 Smart Crop Detection & Farming Assistant
        </h1>
        <p className="text-gray-600">
          Upload plant image for automatic detection or enter details manually.
          Get AI-powered weekly farming plans with reinforcement learning!
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => {
            setActiveTab("image");
            setShowWeeklyPlan(false);
          }}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === "image"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📷 Image Detection
        </button>
        <button
          onClick={() => {
            setActiveTab("manual");
            setShowWeeklyPlan(false);
          }}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === "manual"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ✍️ Manual Input
        </button>
      </div>

      {/* Image Detection Tab */}
      {activeTab === "image" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">📷 Upload Plant Image</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-green-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="plantImage"
                />
                <label htmlFor="plantImage" className="cursor-pointer block">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="text-gray-600 mb-2 font-medium">
                    Click to upload plant photo
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported: Tomato, Rice, Chili, and more
                  </p>
                </label>
              </div>

              {selectedImage && (
                <div className="text-center">
                  <img
                    src={selectedImage}
                    alt="Uploaded plant"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">📊 Detection Results</h2>

              {isProcessing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Analyzing plant image...</p>
                  <p className="text-sm text-gray-500">
                    Generating weekly plan...
                  </p>
                </div>
              ) : (
                renderDetectionResults()
              )}

              {!detectionResult && !isProcessing && (
                <div className="text-center py-8 text-gray-500">
                  <p>Upload a plant image to see detection results</p>
                  <p className="text-sm mt-2">
                    Get AI-powered weekly farming plan with task carry-over
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Plan Display - CORRECTED PLACEMENT */}
          {showWeeklyPlan && weeklyPlan && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <WeeklyPlanner
                  cropInfo={weeklyPlan}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Input Tab */}
      {activeTab === "manual" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">✍️ Enter Crop Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Crop Type
                  </label>
                  <select
                    value={manualCrop}
                    onChange={(e) => setManualCrop(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Since Planting
                  </label>
                  <input
                    type="number"
                    value={manualDays}
                    onChange={(e) =>
                      setManualDays(parseInt(e.target.value) || 1)
                    }
                    min="1"
                    max="120"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Current: Day {manualDays}
                  </p>
                </div>

                <button
                  onClick={handleManualSubmit}
                  disabled={isProcessing}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium transition-colors"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating Plan...
                    </div>
                  ) : (
                    "🎯 Get Farming Plan"
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">📊 Farming Plan</h2>

              {isProcessing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Generating farming plan...
                  </p>
                  <p className="text-sm text-gray-500">
                    Creating weekly schedule...
                  </p>
                </div>
              ) : (
                renderManualResults()
              )}

              {!manualResult && !isProcessing && (
                <div className="text-center py-8 text-gray-500">
                  <p>Enter crop details to generate farming plan</p>
                  <p className="text-sm mt-2">
                    Includes 7-day plan with reinforcement learning
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Plan Display - CORRECTED PLACEMENT */}
          {showWeeklyPlan && weeklyPlan && (
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <WeeklyPlanner
                  cropInfo={weeklyPlan}
                  onTaskUpdate={handleTaskUpdate}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropDetectionInterface;
