// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'patientData': null });
});

// Add listener for navigation to OfficeAlly pages
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url.includes('officeally.com')) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    });
  }
});
