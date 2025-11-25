import React, { useState } from 'react';
import axios from 'axios';

const steps = [
  'Land Details',
  'Infrastructure',
  'Documents',
  'Media',
  'Lease Terms',
  'Review & Submit',
];

const soilTypes = ['Red Soil', 'Black Soil', 'Sandy', 'Clay', 'Loamy', 'Alluvial'];
const topography = ['Flat', 'Sloped', 'Hilly', 'Valley'];
const waterSources = ['Borewell', 'Canal', 'River', 'Pond', 'Rainwater Harvesting', 'Well'];
const irrigationTypes = ['Drip', 'Sprinkler', 'Flood', 'None'];
const cropOptions = [
  'Rice',
  'Wheat',
  'Sugarcane',
  'Cotton',
  'Vegetables',
  'Fruits',
  'Pulses',
  'Millets',
  'Maize',
  'Groundnut',
];

export default function ListYourLand() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Land Details
    state: '',
    district: '',
    taluk: '',
    village: '',
    surveyNumber: '',
    gpsLat: '',
    gpsLng: '',
    pincode: '',
    landmark: '',
    totalArea: '',
    availableArea: '',
    areaUnit: 'acres',
    soilType: '',
    topography: '',
    currentLandUse: '',
    
    // Infrastructure
    waterSources: [],
    waterQuality: 'untested',
    irrigationType: '',
    waterAvailability: '',
    electricityAvailable: false,
    electricityType: '',
    powerBackup: false,
    roadType: '',
    roadDistance: '',
    storageAvailable: false,
    storageCapacity: '',
    
    // Suitable Crops & Restrictions
    suitableCrops: [],
    previousCrops: '',
    organicOnly: false,
    restrictions: '',
    certifications: '',
    
    // Lease Terms
    minLeaseDuration: '',
    maxLeaseDuration: '',
    leaseDurationType: 'years',
    expectedRent: '',
    rentFrequency: 'yearly',
    advanceRequired: false,
    advanceAmount: '',
    additionalCosts: '',
    negotiable: true,
    
    // Farmer Info
    farmerName: '',
    contactNumber: '',
    email: '',
    experience: '',
    preferredContact: 'phone',
    languagesSpoken: '',
    
    // Additional
    availableFrom: '',
    preferredLessee: 'any',
    supportServices: '',
    specialConditions: '',
    
    // Terms
    termsAccepted: false,
    accuracyConfirmed: false,
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    ownership: [],
    identity: [],
    survey: [],
    bank: [],
    soilTest: [],
  });

  const [uploadedMedia, setUploadedMedia] = useState({
    photos: [],
    videos: [],
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    handleInputChange(field, updated);
  };

  const getGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange('gpsLat', position.coords.latitude.toFixed(6));
          handleInputChange('gpsLng', position.coords.longitude.toFixed(6));
        },
        (error) => {
          alert('Unable to get location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleFileUpload = (category, event) => {
    const files = Array.from(event.target.files);
    const fileData = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      file: file,
    }));
    
    setUploadedDocs((prev) => ({
      ...prev,
      [category]: [...prev[category], ...fileData],
    }));
  };

  const handleMediaUpload = (type, event) => {
    const files = Array.from(event.target.files);
    const fileData = files.map((file) => ({
      name: file.name,
      preview: URL.createObjectURL(file),
      file: file,
    }));
    
    setUploadedMedia((prev) => ({
      ...prev,
      [type]: [...prev[type], ...fileData],
    }));
  };

  const removeFile = (category, index) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const removeMedia = (type, index) => {
    const item = uploadedMedia[type][index];
    URL.revokeObjectURL(item.preview);
    setUploadedMedia((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (activeStep === 0) {
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.village) newErrors.village = 'Village is required';
      if (!formData.surveyNumber) newErrors.surveyNumber = 'Survey number is required';
      if (!formData.totalArea) newErrors.totalArea = 'Total area is required';
      if (!formData.soilType) newErrors.soilType = 'Soil type is required';
    } else if (activeStep === 1) {
      if (formData.waterSources.length === 0) newErrors.waterSources = 'Select at least one water source';
      if (!formData.irrigationType) newErrors.irrigationType = 'Irrigation type is required';
    } else if (activeStep === 2) {
      if (uploadedDocs.ownership.length === 0) newErrors.ownership = 'Land ownership proof is required';
      if (uploadedDocs.identity.length === 0) newErrors.identity = 'Identity proof is required';
      if (uploadedDocs.survey.length === 0) newErrors.survey = 'Survey map is required';
    } else if (activeStep === 3) {
      if (uploadedMedia.photos.length < 3) newErrors.photos = 'Upload at least 3 photos';
    } else if (activeStep === 4) {
      if (!formData.minLeaseDuration) newErrors.minLeaseDuration = 'Minimum lease duration is required';
      if (!formData.expectedRent) newErrors.expectedRent = 'Expected rent is required';
      if (!formData.farmerName) newErrors.farmerName = 'Your name is required';
      if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    } else if (activeStep === 5) {
      if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept terms and conditions';
      if (!formData.accuracyConfirmed) newErrors.accuracyConfirmed = 'You must confirm accuracy of information';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateStep()) return;

  const formDataToSend = new FormData();

  // Append all fields
  Object.keys(formData).forEach(key => {
    if (Array.isArray(formData[key])) {
      formDataToSend.append(key, JSON.stringify(formData[key]));
    } else {
      formDataToSend.append(key, formData[key]);
    }
  });

  // Append documents
  Object.keys(uploadedDocs).forEach(docType => {
    uploadedDocs[docType].forEach(file => {
      formDataToSend.append(docType, file.file);
    });
  });

  // Append media
  Object.keys(uploadedMedia).forEach(mediaType => {
    uploadedMedia[mediaType].forEach(file => {
      formDataToSend.append(mediaType, file.file);
    });
  });

  try {
    const submitButton = document.querySelector('.btn-primary');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;

    const response = await axios.post('http://localhost:5000/api/lands', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    submitButton.textContent = originalText;
    submitButton.disabled = false;

    if (response.data.success) {
      alert('✅ ' + response.data.message);
      console.log('Saved land data:', response.data.data);
    } else {
      alert('❌ Error: ' + response.data.message);
    }
  } catch (error) {
    console.error('Submission Error:', error);
    alert('❌ Failed to submit listing. Make sure backend is running at http://localhost:5000');

    const submitButton = document.querySelector('.btn-primary');
    submitButton.textContent = 'Submit Listing ✓';
    submitButton.disabled = false;
  }
};

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="form-section">
            <h3 className="section-title">Location Details</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>
              
              <div className="form-group">
                <label>District *</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className={errors.district ? 'error' : ''}
                />
                {errors.district && <span className="error-text">{errors.district}</span>}
              </div>
              
              <div className="form-group">
                <label>Taluk</label>
                <input
                  type="text"
                  value={formData.taluk}
                  onChange={(e) => handleInputChange('taluk', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Village *</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className={errors.village ? 'error' : ''}
                />
                {errors.village && <span className="error-text">{errors.village}</span>}
              </div>
              
              <div className="form-group">
                <label>Survey Number / Plot Number *</label>
                <input
                  type="text"
                  value={formData.surveyNumber}
                  onChange={(e) => handleInputChange('surveyNumber', e.target.value)}
                  className={errors.surveyNumber ? 'error' : ''}
                />
                {errors.surveyNumber && <span className="error-text">{errors.surveyNumber}</span>}
              </div>
              
              <div className="form-group">
                <label>Pin Code</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Nearby Landmarks</label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
                placeholder="E.g., Near ABC Temple, 2km from XYZ Highway"
              />
            </div>
            
            <div className="gps-section">
              <div className="form-group">
                <label>GPS Latitude</label>
                <input
                  type="text"
                  value={formData.gpsLat}
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>
              
              <div className="form-group">
                <label>GPS Longitude</label>
                <input
                  type="text"
                  value={formData.gpsLng}
                  readOnly
                  placeholder="Auto-filled"
                />
              </div>
              
              <button type="button" onClick={getGPSLocation} className="btn-gps">
                📍 Get My Location
              </button>
            </div>
            
            <hr className="section-divider" />
            
            <h3 className="section-title">Land Specifications</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Total Area *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalArea}
                  onChange={(e) => handleInputChange('totalArea', e.target.value)}
                  className={errors.totalArea ? 'error' : ''}
                />
                {errors.totalArea && <span className="error-text">{errors.totalArea}</span>}
              </div>
              
              <div className="form-group">
                <label>Available Area for Lease</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.availableArea}
                  onChange={(e) => handleInputChange('availableArea', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Unit</label>
                <select
                  value={formData.areaUnit}
                  onChange={(e) => handleInputChange('areaUnit', e.target.value)}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="guntas">Guntas</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Soil Type *</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  className={errors.soilType ? 'error' : ''}
                >
                  <option value="">Select Soil Type</option>
                  {soilTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.soilType && <span className="error-text">{errors.soilType}</span>}
              </div>
              
              <div className="form-group">
                <label>Topography</label>
                <select
                  value={formData.topography}
                  onChange={(e) => handleInputChange('topography', e.target.value)}
                >
                  <option value="">Select Topography</option>
                  {topography.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Current Land Use</label>
                <input
                  type="text"
                  value={formData.currentLandUse}
                  onChange={(e) => handleInputChange('currentLandUse', e.target.value)}
                  placeholder="E.g., Agricultural, Fallow"
                />
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="form-section">
            <h3 className="section-title">Water Availability</h3>
            
            <div className="form-group full-width">
              <label>Water Sources * {errors.waterSources && <span className="error-text">({errors.waterSources})</span>}</label>
              <div className="checkbox-grid">
                {waterSources.map((source) => (
                  <label key={source} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.waterSources.includes(source)}
                      onChange={() => handleMultiSelect('waterSources', source)}
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Irrigation Type *</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                  className={errors.irrigationType ? 'error' : ''}
                >
                  <option value="">Select Type</option>
                  {irrigationTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.irrigationType && <span className="error-text">{errors.irrigationType}</span>}
              </div>
              
              <div className="form-group">
                <label>Water Quality</label>
                <select
                  value={formData.waterQuality}
                  onChange={(e) => handleInputChange('waterQuality', e.target.value)}
                >
                  <option value="tested">Tested - Good Quality</option>
                  <option value="untested">Not Tested</option>
                  <option value="poor">Poor Quality</option>
                </select>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Water Availability Period</label>
              <input
                type="text"
                value={formData.waterAvailability}
                onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
                placeholder="E.g., Year-round, Only during monsoon"
              />
            </div>
            
            <hr className="section-divider" />
            
            <h3 className="section-title">Electricity & Infrastructure</h3>
            
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.electricityAvailable}
                  onChange={(e) => handleInputChange('electricityAvailable', e.target.checked)}
                />
                <span>Electricity Available</span>
              </label>
            </div>
            
            {formData.electricityAvailable && (
              <div className="form-grid">
                <div className="form-group">
                  <label>Connection Type</label>
                  <select
                    value={formData.electricityType}
                    onChange={(e) => handleInputChange('electricityType', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="single">Single Phase</option>
                    <option value="three">Three Phase</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.powerBackup}
                      onChange={(e) => handleInputChange('powerBackup', e.target.checked)}
                    />
                    <span>Power Backup Available</span>
                  </label>
                </div>
              </div>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label>Road Type</label>
                <input
                  type="text"
                  value={formData.roadType}
                  onChange={(e) => handleInputChange('roadType', e.target.value)}
                  placeholder="E.g., Paved road, Highway"
                />
              </div>
              
              <div className="form-group">
                <label>Distance to Motorable Road (km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.roadDistance}
                  onChange={(e) => handleInputChange('roadDistance', e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.storageAvailable}
                  onChange={(e) => handleInputChange('storageAvailable', e.target.checked)}
                />
                <span>Storage/Warehouse Available</span>
              </label>
            </div>
            
            {formData.storageAvailable && (
              <div className="form-group full-width">
                <label>Storage Capacity</label>
                <input
                  type="text"
                  value={formData.storageCapacity}
                  onChange={(e) => handleInputChange('storageCapacity', e.target.value)}
                  placeholder="E.g., 100 tons, 500 sq ft"
                />
              </div>
            )}
            
            <hr className="section-divider" />
            
            <h3 className="section-title">Crop Suitability</h3>
            
            <div className="form-group full-width">
              <label>Suitable Crops</label>
              <div className="checkbox-grid">
                {cropOptions.map((crop) => (
                  <label key={crop} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.suitableCrops.includes(crop)}
                      onChange={() => handleMultiSelect('suitableCrops', crop)}
                    />
                    <span>{crop}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Previously Grown Crops</label>
              <textarea
                rows="2"
                value={formData.previousCrops}
                onChange={(e) => handleInputChange('previousCrops', e.target.value)}
                placeholder="E.g., Rice (2022-2023), Sugarcane (2021-2022)"
              />
            </div>
            
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.organicOnly}
                  onChange={(e) => handleInputChange('organicOnly', e.target.checked)}
                />
                <span>Organic Farming Only</span>
              </label>
            </div>
            
            <div className="form-group full-width">
              <label>Restrictions/Special Conditions</label>
              <textarea
                rows="2"
                value={formData.restrictions}
                onChange={(e) => handleInputChange('restrictions', e.target.value)}
                placeholder="E.g., No heavy machinery, No construction"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Certifications (if any)</label>
              <input
                type="text"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                placeholder="E.g., Organic certified"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="form-section">
            <div className="info-alert">
              ℹ️ All documents should be clear, legible, and in PDF, JPG, or PNG format (Max 5MB per file)
            </div>
            
            <div className="upload-card required">
              <h4>📄 Land Ownership Proof * (Required)</h4>
              <p className="upload-subtitle">Upload Patta, Sale Deed, or Encumbrance Certificate</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('ownership', e)}
                  style={{ display: 'none' }}
                />
                ☁️ Upload Ownership Documents
              </label>
              
              {errors.ownership && <span className="error-text">{errors.ownership}</span>}
              
              <div className="file-chips">
                {uploadedDocs.ownership.map((file, index) => (
                  <div key={index} className="file-chip">
                    <span>📎 {file.name} ({file.size})</span>
                    <button onClick={() => removeFile('ownership', index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="upload-card required">
              <h4>🆔 Identity Proof * (Required)</h4>
              <p className="upload-subtitle">Upload Aadhaar, Voter ID, Passport, or Driving License</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('identity', e)}
                  style={{ display: 'none' }}
                />
                ☁️ Upload Identity Proof
              </label>
              
              {errors.identity && <span className="error-text">{errors.identity}</span>}
              
              <div className="file-chips">
                {uploadedDocs.identity.map((file, index) => (
                  <div key={index} className="file-chip">
                    <span>📎 {file.name} ({file.size})</span>
                    <button onClick={() => removeFile('identity', index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="upload-card required">
              <h4>🗺️ Survey Map / Sketch * (Required)</h4>
              <p className="upload-subtitle">Upload land survey documents showing boundaries</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('survey', e)}
                  style={{ display: 'none' }}
                />
                ☁️ Upload Survey Documents
              </label>
              
              {errors.survey && <span className="error-text">{errors.survey}</span>}
              
              <div className="file-chips">
                {uploadedDocs.survey.map((file, index) => (
                  <div key={index} className="file-chip">
                    <span>📎 {file.name} ({file.size})</span>
                    <button onClick={() => removeFile('survey', index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="upload-card optional">
              <h4>🏦 Bank Details / Cancelled Cheque (Optional)</h4>
              <p className="upload-subtitle">For receiving rent payments</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('bank', e)}
                  style={{ display: 'none' }}
                />
                ☁️ Upload Bank Documents
              </label>
              
              <div className="file-chips">
                {uploadedDocs.bank.map((file, index) => (
                  <div key={index} className="file-chip">
                    <span>📎 {file.name} ({file.size})</span>
                    <button onClick={() => removeFile('bank', index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="upload-card optional">
              <h4>🧪 Soil Test / Other Reports (Optional)</h4>
              <p className="upload-subtitle">Upload soil test report, water quality test, etc.</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('soilTest', e)}
                  style={{ display: 'none' }}
                />
                ☁️ Upload Test Reports
              </label>
              
              <div className="file-chips">
                {uploadedDocs.soilTest.map((file, index) => (
                  <div key={index} className="file-chip">
                    <span>📎 {file.name} ({file.size})</span>
                    <button onClick={() => removeFile('soilTest', index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="form-section">
            <div className="info-alert">
              📸 Upload clear, well-lit photos of your land. Minimum 1 photos required.
            </div>
            
            <div className="upload-card required">
              <h4>📷 Land Photos * (Minimum 1 Required)</h4>
              <p className="upload-subtitle">Upload overview, soil, water source, road access photos</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleMediaUpload('photos', e)}
                  style={{ display: 'none' }}
                />
                🖼️ Upload Photos ({uploadedMedia.photos.length}/10)
              </label>
              
              {errors.photos && <span className="error-text">{errors.photos}</span>}
              
              <div className="media-grid">
                {uploadedMedia.photos.map((item, index) => (
                  <div key={index} className="media-preview">
                    <img src={item.preview} alt={item.name} />
                    <button className="remove-media" onClick={() => removeMedia('photos', index)}>✕</button>
                    <span className="media-name">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="upload-card optional">
              <h4>🎥 Land Videos (Optional)</h4>
              <p className="upload-subtitle">Upload video tour, drone footage (Max 50MB per video)</p>
              
              <label className="upload-btn">
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleMediaUpload('videos', e)}
                  style={{ display: 'none' }}
                />
                🎬 Upload Videos ({uploadedMedia.videos.length}/3)
              </label>
              
              <div className="file-chips">
                {uploadedMedia.videos.map((item, index) => (
                  <div key={index} className="file-chip">
                    <span>🎥 {item.name}</span>
                    <button onClick={() => removeMedia('videos', index)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="form-section">
            <h3 className="section-title">Lease Terms</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Minimum Lease Duration *</label>
                <input
                  type="number"
                  value={formData.minLeaseDuration}
                  onChange={(e) => handleInputChange('minLeaseDuration', e.target.value)}
                  className={errors.minLeaseDuration ? 'error' : ''}
                />
                {errors.minLeaseDuration && <span className="error-text">{errors.minLeaseDuration}</span>}
              </div>
              
              <div className="form-group">
                <label>Maximum Lease Duration</label>
                <input
                  type="number"
                  value={formData.maxLeaseDuration}
                  onChange={(e) => handleInputChange('maxLeaseDuration', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Duration Type</label>
                <select
                  value={formData.leaseDurationType}
                  onChange={(e) => handleInputChange('leaseDurationType', e.target.value)}
                >
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                  <option value="seasons">Seasons</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Expected Rent (₹) *</label>
                <input
                  type="number"
                  value={formData.expectedRent}
                  onChange={(e) => handleInputChange('expectedRent', e.target.value)}
                  className={errors.expectedRent ? 'error' : ''}
                  placeholder="Per acre/season/year"
                />
                {errors.expectedRent && <span className="error-text">{errors.expectedRent}</span>}
              </div>
              
              <div className="form-group">
                <label>Payment Frequency</label>
                <select
                  value={formData.rentFrequency}
                  onChange={(e) => handleInputChange('rentFrequency', e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="per-harvest">Per Harvest</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                  />
                  <span>Price is Negotiable</span>
                </label>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.advanceRequired}
                  onChange={(e) => handleInputChange('advanceRequired', e.target.checked)}
                />
                <span>Advance Payment Required</span>
              </label>
            </div>
            
            {formData.advanceRequired && (
              <div className="form-group full-width">
                <label>Advance Amount (₹)</label>
                <input
                  type="number"
                  value={formData.advanceAmount}
                  onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                />
              </div>
            )}
            
            <div className="form-group full-width">
              <label>Additional Costs/Charges</label>
              <textarea
                rows="2"
                value={formData.additionalCosts}
                onChange={(e) => handleInputChange('additionalCosts', e.target.value)}
                placeholder="E.g., Water/Electricity charges separate, Maintenance charges included"
              />
            </div>
            
            <hr className="section-divider" />
            
            <h3 className="section-title">Your Information</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => handleInputChange('farmerName', e.target.value)}
                  className={errors.farmerName ? 'error' : ''}
                />
                {errors.farmerName && <span className="error-text">{errors.farmerName}</span>}
              </div>
              
              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className={errors.contactNumber ? 'error' : ''}
                  placeholder="+91 XXXXXXXXXX"
                />
                {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
              </div>
              
              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Farming Experience (Years)</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Preferred Contact Method</label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                >
                  <option value="phone">Phone Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Languages Spoken</label>
                <input
                  type="text"
                  value={formData.languagesSpoken}
                  onChange={(e) => handleInputChange('languagesSpoken', e.target.value)}
                  placeholder="E.g., Tamil, English, Hindi"
                />
              </div>
            </div>
            
            <hr className="section-divider" />
            
            <h3 className="section-title">Additional Information</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Available From</label>
                <input
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Preferred Lessee Type</label>
                <select
                  value={formData.preferredLessee}
                  onChange={(e) => handleInputChange('preferredLessee', e.target.value)}
                >
                  <option value="any">Any</option>
                  <option value="individual">Individual Farmer</option>
                  <option value="corporate">Corporate Farming</option>
                  <option value="startup">Agricultural Startup</option>
                </select>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Support Services Available</label>
              <textarea
                rows="2"
                value={formData.supportServices}
                onChange={(e) => handleInputChange('supportServices', e.target.value)}
                placeholder="E.g., Will provide guidance, Local labor available, Nearby market access"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Special Conditions/Notes</label>
              <textarea
                rows="2"
                value={formData.specialConditions}
                onChange={(e) => handleInputChange('specialConditions', e.target.value)}
                placeholder="Any other important information for potential lessees"
              />
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="form-section review-section">
            <h3 className="section-title">Review Your Listing</h3>
            
            <div className="review-card">
              <h4>📍 Location</h4>
              <p><strong>State:</strong> {formData.state || 'Not provided'}</p>
              <p><strong>District:</strong> {formData.district || 'Not provided'}</p>
              <p><strong>Village:</strong> {formData.village || 'Not provided'}</p>
              <p><strong>Survey Number:</strong> {formData.surveyNumber || 'Not provided'}</p>
              {formData.gpsLat && formData.gpsLng && (
                <p><strong>GPS:</strong> {formData.gpsLat}, {formData.gpsLng}</p>
              )}
            </div>
            
            <div className="review-card">
              <h4>🌾 Land Specifications</h4>
              <p><strong>Total Area:</strong> {formData.totalArea} {formData.areaUnit}</p>
              {formData.availableArea && (
                <p><strong>Available for Lease:</strong> {formData.availableArea} {formData.areaUnit}</p>
              )}
              <p><strong>Soil Type:</strong> {formData.soilType || 'Not provided'}</p>
              {formData.topography && <p><strong>Topography:</strong> {formData.topography}</p>}
            </div>
            
            <div className="review-card">
              <h4>💧 Infrastructure</h4>
              <p><strong>Water Sources:</strong> {formData.waterSources.join(', ') || 'None selected'}</p>
              <p><strong>Irrigation:</strong> {formData.irrigationType || 'Not specified'}</p>
              <p><strong>Electricity:</strong> {formData.electricityAvailable ? 'Yes' : 'No'}</p>
              {formData.suitableCrops.length > 0 && (
                <p><strong>Suitable Crops:</strong> {formData.suitableCrops.join(', ')}</p>
              )}
            </div>
            
            <div className="review-card">
              <h4>💰 Lease Terms</h4>
              <p><strong>Expected Rent:</strong> ₹{formData.expectedRent} ({formData.rentFrequency})</p>
              <p><strong>Lease Duration:</strong> {formData.minLeaseDuration} - {formData.maxLeaseDuration || 'Flexible'} {formData.leaseDurationType}</p>
              <p><strong>Negotiable:</strong> {formData.negotiable ? 'Yes' : 'No'}</p>
              {formData.advanceRequired && (
                <p><strong>Advance Required:</strong> ₹{formData.advanceAmount}</p>
              )}
            </div>
            
            <div className="review-card">
              <h4>📄 Documents Uploaded</h4>
              <p><strong>Ownership Proof:</strong> {uploadedDocs.ownership.length} file(s)</p>
              <p><strong>Identity Proof:</strong> {uploadedDocs.identity.length} file(s)</p>
              <p><strong>Survey Map:</strong> {uploadedDocs.survey.length} file(s)</p>
              {uploadedDocs.bank.length > 0 && (
                <p><strong>Bank Details:</strong> {uploadedDocs.bank.length} file(s)</p>
              )}
            </div>
            
            <div className="review-card">
              <h4>📸 Media</h4>
              <p><strong>Photos:</strong> {uploadedMedia.photos.length} uploaded</p>
              {uploadedMedia.videos.length > 0 && (
                <p><strong>Videos:</strong> {uploadedMedia.videos.length} uploaded</p>
              )}
            </div>
            
            <div className="review-card">
              <h4>👤 Your Information</h4>
              <p><strong>Name:</strong> {formData.farmerName}</p>
              <p><strong>Contact:</strong> {formData.contactNumber}</p>
              {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
              <p><strong>Preferred Contact:</strong> {formData.preferredContact}</p>
            </div>
            
            <hr className="section-divider" />
            
            <div className="terms-section">
              <h4>Terms & Conditions</h4>
              
              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                />
                <span>I accept the terms and conditions of the platform *</span>
              </label>
              {errors.termsAccepted && <span className="error-text">{errors.termsAccepted}</span>}
              
              <label className="checkbox-label terms-checkbox">
                <input
                  type="checkbox"
                  checked={formData.accuracyConfirmed}
                  onChange={(e) => handleInputChange('accuracyConfirmed', e.target.checked)}
                />
                <span>I certify that all information provided is accurate and complete *</span>
              </label>
              {errors.accuracyConfirmed && <span className="error-text">{errors.accuracyConfirmed}</span>}
              
              <div className="info-alert" style={{ marginTop: '20px' }}>
                ℹ️ Your listing will be reviewed by our admin team. Once verified, it will be visible to potential lessees. You will be notified via SMS/Email about the approval status.
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="list-your-land-container">
      <div className="header">
        <h1>🌾 List Your Land for Lease</h1>
        <p>Fill in the details to list your agricultural land and connect with potential lessees</p>
      </div>
      
      <div className="stepper">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`step ${index === activeStep ? 'active' : ''} ${
              index < activeStep ? 'completed' : ''
            }`}
          >
            <div className="step-number">
              {index < activeStep ? '✓' : index + 1}
            </div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>
      
      
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStepContent()}
        
        <div className="form-actions">
          <button
            type="button"
            onClick={handleBack}
            disabled={activeStep === 0}
            className="btn-secondary"
          >
            ← Back
          </button>
          
          <div className="step-indicator">
            Step {activeStep + 1} of {steps.length}
          </div>
          
          {activeStep === steps.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-primary"
            >
              Submit Listing ✓
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary"
            >
              Next →
            </button>
          )}
          
        </div>
      </form>
      
      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .list-your-land-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
        }
        
        .header {
          background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .header h1 {
          margin-bottom: 10px;
          font-size: 28px;
        }
        
        .header p {
          opacity: 0.95;
          font-size: 16px;
        }
        
        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow-x: auto;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          min-width: 100px;
        }
        
        .step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: #e0e0e0;
          z-index: 0;
        }
        
        .step.completed:not(:last-child)::after {
          background: #4caf50;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e0e0;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          z-index: 1;
          position: relative;
        }
        
        .step.active .step-number {
          background: #2e7d32;
          color: white;
        }
        
        .step.completed .step-number {
          background: #4caf50;
          color: white;
        }
        
        .step-label {
          font-size: 12px;
          text-align: center;
          color: #666;
          font-weight: 500;
        }
        
        .step.active .step-label {
          color: #2e7d32;
          font-weight: 600;
        }
        
        form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .form-section {
          margin-bottom: 20px;
        }
        
        .section-title {
          color: #2e7d32;
          margin-bottom: 20px;
          font-size: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
          font-size: 14px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2e7d32;
        }
        
        .form-group input.error,
        .form-group select.error {
          border-color: #f44336;
        }
        
        .error-text {
          color: #f44336;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .gps-section {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 15px;
          align-items: end;
          margin-bottom: 20px;
        }
        
        .btn-gps {
          padding: 12px 20px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
          transition: background 0.3s;
        }
        
        .btn-gps:hover {
          background: #1565c0;
        }
        
        .section-divider {
          border: none;
          border-top: 1px solid #e0e0e0;
          margin: 30px 0;
        }
        
        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .checkbox-label input[type="checkbox"] {
          margin-right: 8px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .info-alert {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #1565c0;
        }
        
        .upload-card {
          background: #fafafa;
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          transition: border-color 0.3s;
        }
        
        .upload-card:hover {
          border-color: #2e7d32;
        }
        
        .upload-card.required {
          border-color: #ff9800;
          background: #fff8e1;
        }
        
        .upload-card.optional {
          border-style: dashed;
        }
        
        .upload-card h4 {
          margin-bottom: 8px;
          color: #333;
          font-size: 16px;
        }
        
        .upload-subtitle {
          color: #666;
          font-size: 13px;
          margin-bottom: 15px;
        }
        
        .upload-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #2e7d32;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
          text-align: center;
        }
        
        .upload-btn:hover {
          background: #1b5e20;
        }
        
        .file-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        
        .file-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .file-chip button {
          background: #f44336;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .media-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #ddd;
        }
        
        .media-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .remove-media {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(244, 67, 54, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .media-name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .review-section {
          padding: 0;
        }
        
        .review-card {
          background: #f9f9f9;
          border-left: 4px solid #2e7d32;
          padding: 15px 20px;
          margin-bottom: 15px;
          border-radius: 8px;
        }
        
        .review-card h4 {
          color: #2e7d32;
          margin-bottom: 12px;
          font-size: 16px;
        }
        
        .review-card p {
          margin: 6px 0;
          font-size: 14px;
          color: #555;
        }
        
        .terms-section {
          margin-top: 30px;
        }
        
        .terms-section h4 {
          margin-bottom: 15px;
          color: #333;
        }
        
        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          margin-bottom: 15px;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        .terms-checkbox span {
          font-size: 14px;
          line-height: 1.5;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e0e0e0;
        }
        
        .step-indicator {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }
        
        .btn-primary,
        .btn-secondary {
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-primary {
          background: #2e7d32;
          color: white;
        }
        
        .btn-primary:hover {
          background: #1b5e20;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
        }
        
        .btn-secondary {
          background: #e0e0e0;
          color: #333;
        }
        
        .btn-secondary:hover {
          background: #d0d0d0;
        }
        
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .list-your-land-container {
            padding: 15px;
          }
          
          .header h1 {
            font-size: 22px;
          }
          
          .stepper {
            overflow-x: auto;
            padding: 15px;
          }
          
          .step-label {
            font-size: 10px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .gps-section {
            grid-template-columns: 1fr;
          }
          
          form {
            padding: 20px;
          }
          
          .form-actions {
            flex-direction: column;
            gap: 15px;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
          
          .step-indicator {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}