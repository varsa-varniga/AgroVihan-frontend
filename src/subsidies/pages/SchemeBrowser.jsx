// src/pages/SchemeBrowser.jsx
import React, { useState, useEffect } from "react";
import { schemesAPI } from "../services/api";
import Header from "../components/Common/Header";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  Search,
  Filter,
  DollarSign,
  Clock,
  Users,
  Building,
  X,
  FileText,
  CheckCircle,
  MapPin,
  UserCheck,
} from "lucide-react";

const SchemeBrowser = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    state: "",
    benefitType: "",
  });

  const categories = [
    "loan",
    "subsidy",
    "insurance",
    "training",
    "equipment",
    "infrastructure",
  ];
  const benefitTypes = [
    "one-time",
    "recurring",
    "percentage-based",
    "variable",
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm, filters]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching schemes from API...");
      const response = await schemesAPI.getAll();
      console.log("📦 API Response:", response.data);
      console.log(`🎯 Found ${response.data.schemes?.length || 0} schemes`);

      setSchemes(response.data.schemes || []);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      alert("Failed to load schemes");
    } finally {
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = schemes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (scheme.nameInTamil && scheme.nameInTamil.includes(searchTerm)) ||
          scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scheme.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (scheme) => scheme.category === filters.category
      );
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter((scheme) =>
        scheme.eligibility.applicableStates.includes(filters.state)
      );
    }

    // Benefit type filter
    if (filters.benefitType) {
      filtered = filtered.filter(
        (scheme) => scheme.benefitType === filters.benefitType
      );
    }

    setFilteredSchemes(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "",
      state: "",
      benefitType: "",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      loan: "🏦",
      subsidy: "💰",
      insurance: "🛡️",
      training: "🎓",
      equipment: "⚙️",
      infrastructure: "🏗️",
      other: "📄",
    };
    return icons[category] || "📄";
  };

  const handleApplyNow = (scheme) => {
    // You can implement application logic here
    alert(`Applying for ${scheme.name}`);
    setShowDetails(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner text="Loading government schemes..." />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Government Schemes
          </h1>
          <p className="text-gray-600 mt-2">
            Browse all available government schemes, loans, and subsidies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schemes by name, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryIcon(category)}{" "}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Benefit Type Filter */}
            <div>
              <select
                value={filters.benefitType}
                onChange={(e) =>
                  setFilters({ ...filters, benefitType: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Benefit Types</option>
                {benefitTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters and clear button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Showing {filteredSchemes.length} of {schemes.length} schemes
              </span>
            </div>
            {(searchTerm || filters.category || filters.benefitType) && (
              <button
                onClick={clearFilters}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Schemes Grid */}
        {filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No schemes found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all schemes
            </p>
            <button
              onClick={clearFilters}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Show All Schemes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getCategoryIcon(scheme.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {scheme.name}
                        </h3>
                        {scheme.nameInTamil && (
                          <p className="text-gray-600 text-sm tamil-font">
                            {scheme.nameInTamil}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {scheme.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {scheme.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">Benefit:</span>
                      <span className="ml-1">{scheme.benefit}</span>
                    </div>

                    {scheme.benefitAmount > 0 && (
                      <div className="flex items-center text-sm text-green-600 font-semibold">
                        Amount: ₹{scheme.benefitAmount?.toLocaleString()}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Processing: {scheme.processingTime}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <Building className="h-4 w-4 mr-2 text-purple-600" />
                      <span>By: {scheme.issuingAuthority}</span>
                    </div>
                  </div>

                  {/* Eligibility Info */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Eligibility:</span>
                      </div>
                      <span className="text-green-600 font-medium">
                        Check Your Eligibility
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setShowDetails(true);
                      }}
                      className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleApplyNow(scheme)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed View Modal */}
        {showDetails && selectedScheme && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedScheme.name}
                    </h2>
                    {selectedScheme.nameInTamil && (
                      <p className="text-lg text-gray-600 tamil-font">
                        {selectedScheme.nameInTamil}
                      </p>
                    )}
                    <div className="flex items-center mt-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedScheme.category}
                      </span>
                      <span className="ml-3 flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-1" />
                        {selectedScheme.issuingAuthority}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl p-2"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Scheme Details
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedScheme.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        Benefits
                      </h3>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-green-800 font-medium">
                          {selectedScheme.benefit}
                        </p>
                        {selectedScheme.benefitAmount > 0 && (
                          <p className="text-green-600 text-lg font-bold mt-2">
                            Amount: ₹
                            {selectedScheme.benefitAmount?.toLocaleString()}
                          </p>
                        )}
                        <p className="text-green-700 text-sm mt-2">
                          Benefit Type: {selectedScheme.benefitType}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
                        Eligibility Criteria
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Land Size:</span>
                          <span className="font-medium text-green-700">
                            {selectedScheme.eligibility.minLandSize} -{" "}
                            {selectedScheme.eligibility.maxLandSize} acres
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Income Range:</span>
                          <span className="font-medium text-green-700">
                            ₹
                            {selectedScheme.eligibility.minIncome?.toLocaleString()}{" "}
                            - ₹
                            {selectedScheme.eligibility.maxIncome?.toLocaleString()}
                          </span>
                        </div>
                        {selectedScheme.eligibility.applicableCrops?.length >
                          0 && (
                          <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">
                              Applicable Crops:
                            </span>
                            <span className="font-medium text-right max-w-xs">
                              {selectedScheme.eligibility.applicableCrops.join(
                                ", "
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">KYC Required:</span>
                          <span className="font-medium">
                            {selectedScheme.eligibility.requiresKYC
                              ? "Yes"
                              : "No"}
                          </span>
                        </div>
                        {selectedScheme.eligibility.applicableStates && (
                          <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Available In:</span>
                            <span className="font-medium text-right">
                              {selectedScheme.eligibility.applicableStates.join(
                                ", "
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Application Process
                      </h3>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800 leading-relaxed">
                          {selectedScheme.applicationProcess}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-orange-600" />
                        Required Documents
                      </h3>
                      <ul className="space-y-2">
                        {selectedScheme.requiredDocuments?.map((doc, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-gray-700 bg-orange-50 p-3 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-purple-600" />
                        Timeline & Contact
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="text-gray-600">
                            Processing Time:
                          </span>
                          <span className="font-medium text-purple-700">
                            {selectedScheme.processingTime}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <span className="text-gray-600">
                            Issuing Authority:
                          </span>
                          <span className="font-medium">
                            {selectedScheme.issuingAuthority}
                          </span>
                        </div>
                        {selectedScheme.contactNumber && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <span className="text-gray-600">Contact:</span>
                            <span className="font-medium">
                              {selectedScheme.contactNumber}
                            </span>
                          </div>
                        )}
                        {selectedScheme.officialWebsite && (
                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <span className="text-gray-600">Website:</span>
                            <a
                              href={selectedScheme.officialWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:text-blue-800 underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleApplyNow(selectedScheme)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SchemeBrowser;
