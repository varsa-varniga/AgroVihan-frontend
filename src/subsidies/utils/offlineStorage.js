// src/utils/offlineStorage.js
export const saveApplicationDraft = (applicationData) => {
  const drafts = JSON.parse(localStorage.getItem('applicationDrafts') || '{}');
  drafts[applicationData.schemeId] = {
    ...applicationData,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('applicationDrafts', JSON.stringify(drafts));
};

export const getApplicationDraft = (schemeId) => {
  const drafts = JSON.parse(localStorage.getItem('applicationDrafts') || '{}');
  return drafts[schemeId];
};