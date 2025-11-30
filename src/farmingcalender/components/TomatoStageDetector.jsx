// React Component - TomatoStageDetector.jsx
import React, { useState } from "react";
import axios from "axios";

const TomatoStageDetector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualStage, setManualStage] = useState("vegetative");

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
    setIsAnalyzing(true);
    try {
      const response = await axios.post(
        "http://localhost:5002/api/analyze-tomato-image",
        {
          image: imageData,
        }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis({ error: "Failed to analyze image" });
    }
    setIsAnalyzing(false);
  };

  const handleManualStage = async (stage) => {
    setManualStage(stage);
    try {
      const response = await axios.post(
        "http://localhost:5002/api/manual-stage-selection",
        {
          stage: stage,
        }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.error("Manual stage error:", error);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      germination: "bg-blue-100 text-blue-800",
      seedling: "bg-green-100 text-green-800",
      vegetative: "bg-emerald-100 text-emerald-800",
      flowering: "bg-purple-100 text-purple-800",
      fruiting: "bg-orange-100 text-orange-800",
      harvest: "bg-red-100 text-red-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          🍅 Tomato Growth Stage Detector
        </h1>
        <p className="text-gray-600">
          Upload tomato plant image or select stage manually to get AI-powered
          farming plan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">📷 Image Analysis</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="tomatoImage"
            />
            <label htmlFor="tomatoImage" className="cursor-pointer">
              <div className="text-4xl mb-2">🌱</div>
              <p className="text-gray-600 mb-2">Upload Tomato Plant Image</p>
              <p className="text-sm text-gray-500">
                AI will detect growth stage and generate farming plan
              </p>
            </label>
          </div>

          {selectedImage && (
            <div className="text-center">
              <img
                src={selectedImage}
                alt="Uploaded tomato plant"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Manual Stage Selection */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Or Select Stage Manually:</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "germination",
                "seedling",
                "vegetative",
                "flowering",
                "fruiting",
                "harvest",
              ].map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleManualStage(stage)}
                  className={`p-2 rounded text-sm font-medium ${getStageColor(
                    stage
                  )} ${manualStage === stage ? "ring-2 ring-blue-500" : ""}`}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">📊 Analysis Results</h2>

          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing plant image...</p>
            </div>
          ) : analysis ? (
            <div>
              {analysis.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-700">{analysis.error}</p>
                </div>
              ) : (
                <>
                  {/* Stage Detection Result */}
                  <div
                    className={`p-4 rounded-lg mb-4 ${getStageColor(
                      analysis.detected_stage || analysis.selected_stage
                    )}`}
                  >
                    <h3 className="font-bold text-lg">
                      Detected Stage:{" "}
                      {(
                        analysis.detected_stage || analysis.selected_stage
                      ).toUpperCase()}
                    </h3>
                    {analysis.analysis && (
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Confidence: {analysis.analysis.confidence?.toFixed(1)}
                          %
                        </div>
                        <div>
                          Health Score:{" "}
                          {analysis.analysis.health_score?.toFixed(1)}%
                        </div>
                        <div>
                          Plant Size: {analysis.analysis.plant_size?.toFixed(1)}
                          %
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Daily Plan */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">📅 Today's Tasks</h4>
                    <div className="space-y-2">
                      {analysis.daily_plan?.map((task, index) => (
                        <div
                          key={index}
                          className="p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium">
                              {task.task.replace(/_/g, " ")}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
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
                          <p className="text-sm text-gray-600 mt-1">
                            {task.reason}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            Duration: ~{task.duration}h
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Plan */}
                  <div>
                    <h4 className="font-semibold mb-3">🗓️ This Week's Plan</h4>
                    <div className="space-y-2">
                      {analysis.weekly_plan?.map((task, index) => (
                        <div
                          key={index}
                          className="p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">
                                {task.task.replace(/_/g, " ")}
                              </span>
                              <p className="text-sm text-gray-600">
                                {task.reason}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  task.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {task.priority}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {task.day}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Upload an image or select a stage to see analysis results</p>
            </div>
          )}
        </div>
      </div>

      {/* Growth Timeline */}
      {analysis?.growth_timeline && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">📈 Growth Timeline</h3>
          <div className="flex overflow-x-auto pb-4">
            {analysis.growth_timeline.map((stage, index) => (
              <div key={index} className="flex-shrink-0 w-48 mr-4">
                <div
                  className={`p-4 rounded-lg border-2 ${
                    stage.status === "current"
                      ? "border-green-500 bg-green-50"
                      : stage.status === "completed"
                      ? "border-gray-300 bg-gray-50"
                      : "border-blue-300 bg-blue-50"
                  }`}
                >
                  <div className="font-semibold capitalize">{stage.stage}</div>
                  <div
                    className={`text-sm ${
                      stage.status === "current"
                        ? "text-green-700"
                        : stage.status === "completed"
                        ? "text-gray-600"
                        : "text-blue-600"
                    }`}
                  >
                    {stage.status}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {stage.description}
                  </p>
                  {stage.start_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Started: {stage.start_date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TomatoStageDetector;
