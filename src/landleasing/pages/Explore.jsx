import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8' fill='%232196F3' stroke='white' stroke-width='3'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const landIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='42' viewBox='0 0 24 32'%3E%3Cpath d='M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z' fill='%234caf50' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='9' r='3' fill='white'/%3E%3C/svg%3E",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

const selectedLandIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='42' viewBox='0 0 24 32'%3E%3Cpath d='M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z' fill='%23ff5722' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='9' r='3' fill='white'/%3E%3C/svg%3E",
  iconSize: [38, 50],
  iconAnchor: [19, 50],
});

// Tamil Nadu farmlands data
const tamilNaduLands = [
  {
    id: 1,
    surveyNumber: "TN-2024-001",
    location: "Kanchipuram",
    coordinates: { lat: 12.8342, lng: 79.7036 },
    area: 4.5,
    soilType: "Red Loam",
    irrigation: "Borewell",
    rent: 18000,
    status: "Available",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
  },
  {
    id: 2,
    surveyNumber: "TN-2024-002",
    location: "Tiruvallur",
    coordinates: { lat: 13.1355, lng: 79.9076 },
    area: 3.2,
    soilType: "Black Soil",
    irrigation: "Canal",
    rent: 14000,
    status: "Available",
    images: ["https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"],
  },
  {
    id: 3,
    surveyNumber: "TN-2024-003",
    location: "Vellore",
    coordinates: { lat: 12.9165, lng: 79.1325 },
    area: 6.0,
    soilType: "Laterite",
    irrigation: "Rainwater",
    rent: 22000,
    status: "Available",
    images: ["https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"],
  },
  {
    id: 4,
    surveyNumber: "TN-2024-004",
    location: "Chengalpattu",
    coordinates: { lat: 12.6819, lng: 79.9759 },
    area: 5.5,
    soilType: "Clay Loam",
    irrigation: "Borewell",
    rent: 19000,
    status: "Available",
    images: ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"],
  },
  {
    id: 5,
    surveyNumber: "TN-2024-005",
    location: "Ranipet",
    coordinates: { lat: 12.9249, lng: 79.3308 },
    area: 7.8,
    soilType: "Red Soil",
    irrigation: "Canal",
    rent: 25000,
    status: "Available",
    images: ["https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800"],
  },
  {
    id: 6,
    surveyNumber: "TN-2024-006",
    location: "Tiruvannamalai",
    coordinates: { lat: 12.2253, lng: 79.0747 },
    area: 4.0,
    soilType: "Sandy Loam",
    irrigation: "Borewell",
    rent: 16000,
    status: "Available",
    images: ["https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?w=800"],
  },
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Component to recenter map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 11);
    }
  }, [center, map]);
  return null;
};

// Leaflet Map Component
const LeafletMap = ({ lands, userLocation, selectedLand, onLandSelect, mapType }) => {
  const center = userLocation || { lat: 12.9165, lng: 79.1325 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    >
      <RecenterMap center={center} />
      
      {mapType === "satellite" ? (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='© <a href="https://www.esri.com/">Esri</a>'
        />
      ) : (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      )}

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      {lands.map((land) => (
        <Marker
          key={land.id}
          position={[land.coordinates.lat, land.coordinates.lng]}
          icon={selectedLand === land.id ? selectedLandIcon : landIcon}
          eventHandlers={{
            click: () => onLandSelect(land.id),
          }}
        >
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#212121" }}>
                {land.location}
              </h3>
              <p style={{ margin: "4px 0", fontSize: "13px", color: "#757575" }}>
                {land.area} acres • {land.soilType}
              </p>
              {land.distance && (
                <p style={{ margin: "4px 0", fontSize: "13px", color: "#2e7d32", fontWeight: "600" }}>
                  📍 {land.distance.toFixed(1)} km away
                </p>
              )}
              <p style={{ margin: "8px 0 0 0", fontSize: "15px", fontWeight: "700", color: "#2e7d32" }}>
                ₹{land.rent.toLocaleString()}/month
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const Explore = () => {
  const navigate = useNavigate();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [selectedRadius, setSelectedRadius] = useState("3");
  const [viewMode, setViewMode] = useState("all");
  const [mapViewMode, setMapViewMode] = useState("both");
  const [mapType, setMapType] = useState("standard");
  const [fullMapView, setFullMapView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [soilFilter, setSoilFilter] = useState("all");
  const [irrigationFilter, setIrrigationFilter] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLands, setNearbyLands] = useState(tamilNaduLands);
  const [selectedLand, setSelectedLand] = useState(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    // Show location modal on mount
    setShowLocationModal(true);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userLoc);
        setLocationEnabled(true);
        setShowLocationModal(false);
        setLocationError("");
        calculateNearbyLands(userLoc, parseFloat(selectedRadius));
        setViewMode("nearby");
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(
          "Unable to retrieve your location. Please enable location services and try again."
        );
      }
    );
  };

  const handleEnableLocation = () => {
    getCurrentLocation();
  };

  const calculateNearbyLands = (userLoc, radius) => {
    const landsWithDistance = tamilNaduLands
      .map((land) => ({
        ...land,
        distance: calculateDistance(
          userLoc.lat,
          userLoc.lng,
          land.coordinates.lat,
          land.coordinates.lng
        ),
      }))
      .filter((land) => land.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    setNearbyLands(landsWithDistance);
  };

  const handleApplyRadius = () => {
    if (userLocation) {
      calculateNearbyLands(userLocation, parseFloat(selectedRadius));
      setViewMode("nearby");
    }
  };

  const handleViewAll = () => {
    setViewMode("all");
    const allLandsWithDistance = userLocation
      ? tamilNaduLands.map((land) => ({
          ...land,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            land.coordinates.lat,
            land.coordinates.lng
          ),
        }))
      : tamilNaduLands;
    setNearbyLands(allLandsWithDistance);
  };

  const handleSkipLocation = () => {
    setShowLocationModal(false);
    setLocationEnabled(false);
    setViewMode("all");
    setNearbyLands(tamilNaduLands);
  };

  const filteredLands = nearbyLands.filter((land) => {
    const matchesSearch =
      land.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      land.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSoil = soilFilter === "all" || land.soilType === soilFilter;
    const matchesIrrigation = irrigationFilter === "all" || land.irrigation === irrigationFilter;
    return matchesSearch && matchesSoil && matchesIrrigation;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Location Permission Modal */}
      {showLocationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "48px 40px",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              animation: "slideUp 0.4s ease-out",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                margin: "0 auto 28px",
                backgroundColor: "#e8f5e9",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(46,125,50,0.2)",
              }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2e7d32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h2
              style={{
                fontSize: "28px",
                color: "#212121",
                marginBottom: "16px",
                fontWeight: "700",
                lineHeight: "1.3",
              }}
            >
              Turn On Location for Better Experience
            </h2>
            <p
              style={{
                color: "#616161",
                marginBottom: "32px",
                lineHeight: "1.7",
                fontSize: "16px",
              }}
            >
              We'll show you nearby farmlands in Tamil Nadu. Your location will only be used to find farms within your selected radius.
            </p>
            {locationError && (
              <div
                style={{
                  color: "#c62828",
                  marginBottom: "24px",
                  fontSize: "14px",
                  backgroundColor: "#ffebee",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #ef9a9a",
                  lineHeight: "1.5",
                }}
              >
                <strong>⚠️ Error:</strong> {locationError}
              </div>
            )}
            <button
              onClick={handleEnableLocation}
              style={{
                width: "100%",
                padding: "18px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "17px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(46,125,50,0.35)",
                transition: "all 0.3s ease",
                marginBottom: "12px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1b5e20";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 24px rgba(46,125,50,0.45)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#2e7d32";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 6px 20px rgba(46,125,50,0.35)";
              }}
            >
              Turn On Location
            </button>
            <button
              onClick={handleSkipLocation}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "transparent",
                color: "#757575",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f5f5f5";
                e.target.style.color = "#424242";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#757575";
              }}
            >
              Not Now
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "500",
              color: "#424242",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
<button
  onClick={() => navigate("/dashboard")}
  style={{
    padding: "10px 24px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    background: "white",
    color: "#424242",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "#f59e0b";
    e.target.style.color = "white";
    e.target.style.borderColor = "#f59e0b";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "white";
    e.target.style.color = "#424242";
    e.target.style.borderColor = "#e0e0e0";
  }}
>
  My Dashboard
</button>

        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "40px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              marginBottom: "10px",
              color: "#212121",
              letterSpacing: "-0.5px",
            }}
          >
            Explore Farmlands
          </h1>
          <p style={{ color: "#757575", fontSize: "16px" }}>
            Discover and explore verified farmlands across Tamil Nadu
          </p>
        </div>

        {/* Location & Radius Controls */}
        {locationEnabled && (
          <div
            style={{
              backgroundColor: "white",
              padding: "24px 28px",
              borderRadius: "16px",
              marginBottom: "28px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              border: "1px solid #e8f5e9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  boxShadow: "0 0 0 3px rgba(76,175,80,0.2)",
                }}
              ></div>
              <span style={{ fontWeight: "600", color: "#2e7d32", fontSize: "15px" }}>
                Location Enabled
              </span>
            </div>

            <div
              style={{
                height: "24px",
                width: "1px",
                backgroundColor: "#e0e0e0",
              }}
            ></div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <label style={{ fontWeight: "500", color: "#616161", fontSize: "15px" }}>
                Search Radius:
              </label>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(e.target.value)}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  color: "#424242",
                  fontWeight: "500",
                  minWidth: "120px",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              >
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
              </select>
            </div>

            <button
              onClick={handleApplyRadius}
              style={{
                padding: "10px 24px",
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(46,125,50,0.2)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1b5e20";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(46,125,50,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#2e7d32";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(46,125,50,0.2)";
              }}
            >
              Apply
            </button>

            <button
              onClick={handleViewAll}
              style={{
                padding: "10px 24px",
                backgroundColor: "white",
                color: "#424242",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#2e7d32";
                e.target.style.color = "#2e7d32";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.color = "#424242";
              }}
            >
              View All
            </button>

            {viewMode === "nearby" && nearbyLands.length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  color: "#616161",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: "#f5f5f5",
                  padding: "8px 16px",
                  borderRadius: "20px",
                }}
              >
                {filteredLands.length} lands within {selectedRadius} km
              </span>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div style={{ position: "relative" }}>
            <svg
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9e9e9e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by location or survey number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 48px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                fontSize: "15px",
                boxSizing: "border-box",
                backgroundColor: "white",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2e7d32";
                e.target.style.boxShadow = "0 0 0 3px rgba(46,125,50,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <select
            value={soilFilter}
            onChange={(e) => setSoilFilter(e.target.value)}
            style={{
              padding: "14px 16px",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer",
              color: "#424242",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
          >
            <option value="all">All Soil Types</option>
            <option value="Red Loam">Red Loam</option>
            <option value="Black Soil">Black Soil</option>
            <option value="Laterite">Laterite</option>
            <option value="Clay Loam">Clay Loam</option>
            <option value="Sandy Loam">Sandy Loam</option>
            <option value="Red Soil">Red Soil</option>
          </select>

          <select
            value={irrigationFilter}
            onChange={(e) => setIrrigationFilter(e.target.value)}
            style={{
              padding: "14px ",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer",
              color: "#424242",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#2e7d32")}
            onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
          >
            <option value="all">All Irrigation Types</option>
            <option value="Borewell">Borewell</option>
            <option value="Canal">Canal</option>
            <option value="Rainwater">Rainwater</option>
          </select>
        </div>

        {/* View Mode Controls */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px 28px",
            borderRadius: "16px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "600", color: "#424242", fontSize: "15px" }}>
              View Mode:
            </span>
            <div
              style={{
                display: "flex",
                gap: "8px",
                backgroundColor: "#f5f5f5",
                padding: "4px",
                borderRadius: "10px",
              }}
            >
              <button
                onClick={() => setMapViewMode("map")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: mapViewMode === "map" ? "#2e7d32" : "transparent",
                  color: mapViewMode === "map" ? "white" : "#616161",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                </svg>
                Map Only
              </button>
              <button
                onClick={() => setMapViewMode("land")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: mapViewMode === "land" ? "#2e7d32" : "transparent",
                  color: mapViewMode === "land" ? "white" : "#616161",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                List Only
              </button>
              <button
                onClick={() => setMapViewMode("both")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: mapViewMode === "both" ? "#2e7d32" : "transparent",
                  color: mapViewMode === "both" ? "white" : "#616161",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                </svg>
                Both
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {(mapViewMode === "map" || mapViewMode === "both") && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  backgroundColor: "#f5f5f5",
                  padding: "4px",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => setMapType("standard")}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: mapType === "standard" ? "white" : "transparent",
                    color: "#616161",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: mapType === "standard" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMapType("satellite")}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: mapType === "satellite" ? "white" : "transparent",
                    color: "#616161",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: mapType === "satellite" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  Satellite
                </button>
              </div>
            )}
            <button
              onClick={() => setFullMapView(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "white",
                color: "#2e7d32",
                border: "2px solid #2e7d32",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#2e7d32";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#2e7d32";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
              Full Map View
            </button>
          </div>
        </div>

        {/* Full Map Modal */}
        {fullMapView && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "1600px",
                height: "90vh",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Map Type Toggle in Full View */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  zIndex: 1000,
                  display: "flex",
                  gap: "8px",
                  backgroundColor: "white",
                  padding: "6px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                <button
                  onClick={() => setMapType("standard")}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: mapType === "standard" ? "#2e7d32" : "white",
                    color: mapType === "standard" ? "white" : "#616161",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMapType("satellite")}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: mapType === "satellite" ? "#2e7d32" : "white",
                    color: mapType === "satellite" ? "white" : "#616161",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Satellite
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setFullMapView(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "48px",
                  height: "48px",
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "28px",
                  zIndex: 1000,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  color: "#424242",
                  fontWeight: "300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f44336";
                  e.target.style.color = "white";
                  e.target.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "#424242";
                  e.target.style.transform = "rotate(0deg)";
                }}
              >
                ×
              </button>

              {/* Results Counter */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  zIndex: 1000,
                  backgroundColor: "white",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#424242",
                }}
              >
                📍 <strong style={{ color: "#2e7d32" }}>{filteredLands.length}</strong> farmlands
                {viewMode === "nearby" && ` within ${selectedRadius} km`}
              </div>

              <LeafletMap
                lands={filteredLands}
                userLocation={userLocation}
                selectedLand={selectedLand}
                onLandSelect={setSelectedLand}
                mapType={mapType}
              />
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              mapViewMode === "land"
                ? "1fr"
                : mapViewMode === "map"
                ? "1fr"
                : "minmax(400px, 1fr) minmax(500px, 1.2fr)",
            gap: "32px",
          }}
        >
          {/* Map View */}
          {(mapViewMode === "map" || mapViewMode === "both") && (
            <div
              style={{
                position: mapViewMode === "both" ? "sticky" : "relative",
                top: mapViewMode === "both" ? "120px" : "0",
                height: mapViewMode === "map" ? "calc(100vh - 200px)" : "700px",
                order: mapViewMode === "both" ? 2 : 1,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: "2px solid #e8f5e9",
                }}
              >
                <LeafletMap
                  lands={filteredLands}
                  userLocation={userLocation}
                  selectedLand={selectedLand}
                  onLandSelect={setSelectedLand}
                  mapType={mapType}
                />
              </div>
            </div>
          )}

          {/* Lands List */}
          {(mapViewMode === "land" || mapViewMode === "both") && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                order: mapViewMode === "both" ? 1 : 1,
              }}
            >
              {filteredLands.length === 0 ? (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "60px 40px",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#bdbdbd"
                    strokeWidth="2"
                    style={{ margin: "0 auto 24px" }}
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <h3
                    style={{
                      fontSize: "22px",
                      color: "#424242",
                      marginBottom: "12px",
                      fontWeight: "600",
                    }}
                  >
                    No Farmlands Found
                  </h3>
                  <p style={{ color: "#757575", fontSize: "16px", marginBottom: "28px" }}>
                    {viewMode === "nearby"
                      ? `No farmlands found within ${selectedRadius} km radius. Try increasing the radius or view all available lands.`
                      : "No farmlands match your search criteria. Try adjusting your filters."}
                  </p>
                  {viewMode === "nearby" && (
                    <button
                      onClick={handleViewAll}
                      style={{
                        padding: "14px 32px",
                        backgroundColor: "#2e7d32",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#1b5e20";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#2e7d32";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      View All Available Lands
                    </button>
                  )}
                </div>
              ) : (
                filteredLands.map((land) => (
                  <div
                    key={land.id}
                    onMouseEnter={() => setSelectedLand(land.id)}
                    onMouseLeave={() => setSelectedLand(null)}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow:
                        selectedLand === land.id
                          ? "0 12px 32px rgba(46,125,50,0.2)"
                          : "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      border:
                        selectedLand === land.id ? "3px solid #2e7d32" : "3px solid transparent",
                      transform: selectedLand === land.id ? "translateY(-4px)" : "translateY(0)",
                    }}
                  >
                    {/* Land Image */}
                    <div style={{ position: "relative" }}>
                      <img
                        src={land.images[0]}
                        alt={land.location}
                        style={{
                          width: "100%",
                          height: "260px",
                          objectFit: "cover",
                        }}
                      />
                      {land.distance !== undefined && (
                        <div
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            backgroundColor: "rgba(255,255,255,0.95)",
                            backdropFilter: "blur(8px)",
                            padding: "10px 18px",
                            borderRadius: "24px",
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#2e7d32",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#2e7d32"
                            stroke="#2e7d32"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3" fill="white"></circle>
                          </svg>
                          {land.distance.toFixed(1)} km
                        </div>
                      )}
                      <div
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          backgroundColor:
                            land.status === "Available"
                              ? "rgba(76,175,80,0.95)"
                              : "rgba(255,152,0,0.95)",
                          backdropFilter: "blur(8px)",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "white",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        {land.status}
                      </div>
                    </div>

                    {/* Land Details */}
                    <div style={{ padding: "24px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "16px",
                        }}
                      >
                        <div>
                          <h2
                            style={{
                              fontSize: "22px",
                              fontWeight: "700",
                              margin: "0 0 6px 0",
                              color: "#212121",
                              letterSpacing: "-0.3px",
                            }}
                          >
                            {land.location}
                          </h2>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#9e9e9e",
                              margin: 0,
                              fontWeight: "500",
                            }}
                          >
                            Survey: {land.surveyNumber}
                          </p>
                        </div>
                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "24px",
                              fontWeight: "800",
                              color: "#2e7d32",
                              lineHeight: "1",
                            }}
                          >
                            ₹{land.rent.toLocaleString()}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#9e9e9e",
                              marginTop: "4px",
                              fontWeight: "500",
                            }}
                          >
                            per month
                          </div>
                        </div>
                      </div>

                      {/* Land Stats Grid */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "16px",
                          marginTop: "20px",
                          paddingTop: "20px",
                          borderTop: "2px solid #f5f5f5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "10px",
                          }}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2e7d32"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                          </svg>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#212121",
                            }}
                          >
                            {land.area}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#757575",
                              fontWeight: "500",
                            }}
                          >
                            Acres
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "10px",
                          }}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2e7d32"
                            strokeWidth="2"
                          >
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                          </svg>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "#212121",
                              textAlign: "center",
                              lineHeight: "1.2",
                            }}
                          >
                            {land.soilType}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#757575",
                              fontWeight: "500",
                            }}
                          >
                            Soil Type
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "10px",
                          }}
                        >
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2e7d32"
                            strokeWidth="2"
                          >
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                          </svg>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "#212121",
                              textAlign: "center",
                              lineHeight: "1.2",
                            }}
                          >
                            {land.irrigation}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#757575",
                              fontWeight: "500",
                            }}
                          >
                            Irrigation
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div style={{ padding: "0 24px 24px" }}>
                      <button
                        style={{
                          width: "100%",
                          padding: "16px",
                          backgroundColor: "#2e7d32",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#1b5e20";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 6px 16px rgba(46,125,50,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#2e7d32";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 12px rgba(46,125,50,0.3)";
                        }}
                      >
                        View Full Details →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .leaflet-popup-tip {
          background: white;
        }

        .leaflet-container {
          font-family: inherit;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9e9e9e;
        }
      `}</style>
    </div>
  );
};

export default Explore;

