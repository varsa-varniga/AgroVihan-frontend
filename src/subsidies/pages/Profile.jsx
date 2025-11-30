// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { profileAPI, ocrAPI } from "../services/api";
import Header from "../components/Common/Header";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Save,
  Crop,
} from "lucide-react";

const Profile = () => {
  const { farmer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState({
    aadhar: false,
    landRecord: false,
    incomeProof: false,
    bankPassbook: false,
  });

  const [profile, setProfile] = useState({
    landSize: "",
    landOwnership: "",
    annualIncome: "",
    incomeSource: "",
    crops: [],
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    soilType: "Unknown",
    waterAccess: "Rainfed",
    pastLoans: false,
    loanAmount: "",
    loanStatus: "none",
    documents: {
      aadhar: null,
      landRecord: null,
      incomeProof: null,
      bankPassbook: null,
    },
  });

  const [newCrop, setNewCrop] = useState("");

  useEffect(() => {
    if (farmer) {
      const financialProfile = farmer.financialProfile || {};
      setProfile({
        landSize: financialProfile.landSize || "",
        landOwnership: financialProfile.landOwnership || "none",
        annualIncome: financialProfile.annualIncome || "",
        incomeSource: financialProfile.incomeSource || "farming",
        crops: financialProfile.crops || [],
        district: financialProfile.district || "",
        state: financialProfile.state || "Tamil Nadu",
        pincode: financialProfile.pincode || "",
        soilType: financialProfile.soilType || "Unknown",
        waterAccess: financialProfile.waterAccess || "Rainfed",
        pastLoans: financialProfile.pastLoans || false,
        loanAmount: financialProfile.loanAmount || "",
        loanStatus: financialProfile.loanStatus || "none",
        documents: financialProfile.documents || {
          aadhar: null,
          landRecord: null,
          incomeProof: null,
          bankPassbook: null,
        },
      });

      // Initialize uploaded documents status
      if (financialProfile.documents) {
        setUploadedDocuments({
          aadhar: !!financialProfile.documents.aadhar,
          landRecord: !!financialProfile.documents.landRecord,
          incomeProof: !!financialProfile.documents.incomeProof,
          bankPassbook: !!financialProfile.documents.bankPassbook,
        });
      }

      fetchStats();
    }
  }, [farmer]);

  useEffect(() => {
    if (stats) {
      debugKYCStatus();
    }
  }, [stats]);

  const fetchStats = async () => {
    try {
      const response = await profileAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  // Temporary function to test KYC verification
  const testKYCVerification = async () => {
    try {
      const response = await profileAPI.verifyKYC(); // You'll need to add this to your api.js
      alert("KYC Verified: " + response.data.message);
      await fetchStats(); // Refresh stats
    } catch (error) {
      alert("KYC Verification failed: " + error.message);
    }
  };

  // Calculate real-time completion percentage
  const calculateCompletion = () => {
    const fields = [
      profile.landSize > 0,
      profile.annualIncome > 0,
      profile.crops.length > 0,
      profile.district,
      profile.soilType !== "Unknown",
      uploadedDocuments.aadhar,
      uploadedDocuments.landRecord,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // ✅ ADD THIS: Calculate uploaded documents count (only the 3 main documents)
  const uploadedDocumentsCount = Object.keys(uploadedDocuments)
    .filter((doc) => ["aadhar", "landRecord", "incomeProof"].includes(doc))
    .filter((doc) => uploadedDocuments[doc]).length;

  const totalDocuments = 3; // Only 3 main documents

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Remove documents from profile data before sending to update
      const { documents, ...profileData } = profile;
      const response = await profileAPI.update(profileData);
      alert(response.data.message);
      await fetchStats(); // Refresh stats after update
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // In Profile.jsx - Update handleDocumentUpload function
  const handleDocumentUpload = async (documentType, file) => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("documentType", documentType);

      console.log(`Uploading ${documentType} document:`, file.name);

      const response = await ocrAPI.processDocument(formData);

      if (response.data.success) {
        // Mark document as uploaded
        setUploadedDocuments((prev) => ({
          ...prev,
          [documentType]: true,
        }));

        let successMessage = `✅ ${documentType
          .replace(/([A-Z])/g, " $1")
          .toUpperCase()} uploaded successfully!`;

        // Process extracted data if available
        if (
          response.data.extractedData &&
          Object.keys(response.data.extractedData).length > 0
        ) {
          const extractedData = response.data.extractedData;
          const updates = {};

          if (extractedData.name) updates.name = extractedData.name;
          if (extractedData.district) updates.district = extractedData.district;
          if (extractedData.area) {
            const areaMatch = extractedData.area.match(/([\d.]+)/);
            if (areaMatch) updates.landSize = parseFloat(areaMatch[1]);
          }
          if (extractedData.annualIncome)
            updates.annualIncome = extractedData.annualIncome;

          if (Object.keys(updates).length > 0) {
            setProfile((prev) => ({ ...prev, ...updates }));
            await profileAPI.update(updates);
            successMessage += " Profile updated with extracted data.";
          }
        }

        // Update documents in backend
        const docResponse = await profileAPI.updateDocuments({
          [documentType]: `uploaded_${file.name}_${Date.now()}`,
        });

        // ✅ Check if KYC was auto-verified
        if (docResponse.data.kycVerified) {
          successMessage += " KYC verified automatically!";
        }

        // Update local state
        setProfile((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [documentType]: `uploaded_${file.name}_${Date.now()}`,
          },
        }));

        alert(successMessage);
        await fetchStats(); // Refresh completion stats - this will now show updated KYC
      } else {
        alert(
          "Document uploaded but processing failed. Please check the file and try again."
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Upload failed: ";

      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Unknown error occurred";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const addCrop = () => {
    if (newCrop.trim() && !profile.crops.includes(newCrop.trim())) {
      setProfile((prev) => ({
        ...prev,
        crops: [...prev.crops, newCrop.trim()],
      }));
      setNewCrop("");
    }
  };

  const removeCrop = (cropToRemove) => {
    setProfile((prev) => ({
      ...prev,
      crops: prev.crops.filter((crop) => crop !== cropToRemove),
    }));
  };

  const debugKYCStatus = () => {
    console.log("🔍 KYC DEBUG INFO:");
    console.log("Uploaded Documents:", uploadedDocuments);
    console.log("Stats from API:", stats);
    console.log("Farmer Data:", farmer);
    console.log(
      "All documents uploaded?",
      uploadedDocuments.aadhar &&
        uploadedDocuments.landRecord &&
        uploadedDocuments.incomeProof
    );
  };

  if (!farmer) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profile & Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your financial profile and personal information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                👤 Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={farmer.name}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={farmer.email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={farmer.phone}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.district || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, district: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your district"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Profile */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                💰 Financial Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Size (acres)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={profile.landSize || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, landSize: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Ownership
                  </label>
                  <select
                    value={profile.landOwnership || "none"}
                    onChange={(e) =>
                      setProfile({ ...profile, landOwnership: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="none">Select Ownership</option>
                    <option value="owned">Owned</option>
                    <option value="leased">Leased</option>
                    <option value="family">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    value={profile.annualIncome || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, annualIncome: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 80000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Income Source
                  </label>
                  <select
                    value={profile.incomeSource || "farming"}
                    onChange={(e) =>
                      setProfile({ ...profile, incomeSource: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="farming">Farming</option>
                    <option value="labor">Labor</option>
                    <option value="mixed">Mixed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Crops */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crops Grown
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCrop()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add a crop (e.g., Green Gram)"
                  />
                  <button
                    onClick={addCrop}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Crop className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.crops.map((crop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {crop}
                      <button
                        onClick={() => removeCrop(crop)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type
                  </label>
                  <select
                    value={profile.soilType || "Unknown"}
                    onChange={(e) =>
                      setProfile({ ...profile, soilType: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Unknown">Select Soil Type</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Clay">Clay</option>
                    <option value="Red">Red</option>
                    <option value="Black">Black</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Access
                  </label>
                  <select
                    value={profile.waterAccess || "Rainfed"}
                    onChange={(e) =>
                      setProfile({ ...profile, waterAccess: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Rainfed">Rainfed</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Canal">Canal</option>
                    <option value="River">River</option>
                    <option value="Pond">Pond</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center shadow-md"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            {/* Profile Stats Section - Update this part */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Statistics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-medium">
                      {calculateCompletion()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${calculateCompletion()}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Documents Uploaded</span>
                    <span className="font-medium">
                      {uploadedDocumentsCount}/3{" "}
                      {/* ✅ Now shows 0/3, 1/3, 2/3, or 3/3 */}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-500"
                      style={{
                        width: `${(uploadedDocumentsCount / 3) * 100}%`, // ✅ Fixed calculation
                      }}
                    />
                  </div>
                </div>

                {stats && (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Eligibility Score</span>
                        <span className="font-medium">
                          {stats.eligibilityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stats.eligibilityScore >= 80
                              ? "bg-green-500"
                              : stats.eligibilityScore >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${stats.eligibilityScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">KYC Verified</span>
                          <span
                            className={`font-medium ${
                              stats.kycVerified
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {stats.kycVerified ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📄 Document Upload
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload documents to auto-fill your profile and increase
                eligibility score
              </p>

              <div className="space-y-4">
                {[
                  {
                    type: "aadhar",
                    label: "Aadhar Card",
                    accepted: ".jpg, .jpeg, .png, .pdf",
                    description: "For identity verification",
                  },
                  {
                    type: "landRecord",
                    label: "Land Record",
                    accepted: ".jpg, .jpeg, .png, .pdf",
                    description: "For land ownership proof",
                  },
                  {
                    type: "incomeProof",
                    label: "Income Proof",
                    accepted: ".jpg, .jpeg, .png, .pdf",
                    description: "For income verification",
                  },
                ].map((doc) => (
                  <div
                    key={doc.type}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {doc.label}
                        </label>
                        <p className="text-xs text-gray-500">
                          {doc.description}
                        </p>
                      </div>
                      {uploadedDocuments[doc.type] && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept={doc.accepted}
                      onChange={(e) =>
                        handleDocumentUpload(doc.type, e.target.files[0])
                      }
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>

              {loading && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-blue-600">
                      Processing document...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Missing Fields */}
            {stats?.missingFields && stats.missingFields.length > 0 && (
              <div className="bg-yellow-50 rounded-xl shadow-md p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Complete Your Profile
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Add these details to increase your eligibility score:
                </p>
                <ul className="space-y-1 text-sm text-yellow-600">
                  {stats.missingFields.map((field, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                      {field}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
