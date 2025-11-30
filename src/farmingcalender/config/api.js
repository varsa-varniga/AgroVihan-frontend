// src/config/api.js
const API_BASE_URL = 'http://localhost:5002';

export const API_ENDPOINTS = {
  WEATHER: `${API_BASE_URL}/api/weather`,
  DETECT_CROP: `${API_BASE_URL}/api/detect-crop`,
  DETECT_AND_PLAN: `${API_BASE_URL}/api/detect-and-plan`,
  WEEKLY_PLAN: `${API_BASE_URL}/api/weekly-plan`,
  MANUAL_INPUT: `${API_BASE_URL}/api/manual-input`,
  UPDATE_TASK_STATUS: `${API_BASE_URL}/api/update-task-status`,
  TOMATO_TEST: `${API_BASE_URL}/api/tomato-test`
};

export default API_BASE_URL;