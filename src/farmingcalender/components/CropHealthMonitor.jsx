import React, { useState } from "react";
import axios from "axios";

const CropHealthMonitor = () => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCropHealth = async (imageFile) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Simulate AI analysis - in real app, connect to ML model
      const response = await axios.post("/api/analyze-crop-health", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysis(response.data);

      // Auto-create tasks based on analysis
      if (response.data.issues.length > 0) {
        response.data.issues.forEach((issue) => {
          axios.post("/api/tasks", {
            title: issue.recommendation,
            type: issue.type,
            reason: `Crop health issue: ${issue.description}`,
            date: new Date(),
            completed: false,
            priority: "high",
          });
        });
      }
    } catch (error) {
      console.log("Analysis error:", error);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">🔍 Crop Health Monitor</h3>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => analyzeCropHealth(e.target.files[0])}
          className="hidden"
          id="cropImage"
        />
        <label htmlFor="cropImage" className="cursor-pointer">
          <div className="text-4xl mb-2">📸</div>
          <p className="text-gray-600 mb-2">Take photo of your crop</p>
          <p className="text-sm text-gray-500">
            AI will analyze for pests, diseases, nutrient deficiencies
          </p>
        </label>
      </div>

      {isAnalyzing && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Analyzing crop health...</p>
        </div>
      )}

      {analysis && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-bold text-green-800">Analysis Results:</h4>
          <p className="text-green-700">
            Health Score: {analysis.healthScore}%
          </p>

          {analysis.issues.map((issue, index) => (
            <div key={index} className="mt-2 p-2 bg-yellow-50 rounded">
              <p className="text-sm font-medium">{issue.description}</p>
              <p className="text-xs text-gray-600">
                Recommended: {issue.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropHealthMonitor;
