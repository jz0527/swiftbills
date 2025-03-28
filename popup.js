class UIManager {
  static showError(message) {
    const status = document.getElementById('status');
    status.textContent = `Error: ${message}`;
    status.style.color = 'red';
    status.style.backgroundColor = '#ffe6e6';
    setTimeout(() => status.textContent = '', 3000);
  }

  static showSuccess(message) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.color = 'green';
    status.style.backgroundColor = '#e6ffe6';
    setTimeout(() => status.textContent = '', 3000);
  }
}

// Function to execute content script functions
async function executeContentScript(functionName) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url.includes('officeally.com') && !tab.url.includes('test.html')) {
      UIManager.showError('Please navigate to OfficeAlly website or test page');
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // This will be executed in the context of the web page
        if (functionName === 'autofill') {
          window.dispatchEvent(new CustomEvent('autofillForm'));
        } else if (functionName === 'save') {
          window.dispatchEvent(new CustomEvent('saveFormData'));
        }
      }
    });
    
    UIManager.showSuccess(`${functionName === 'autofill' ? 'Form filled' : 'Data saved'} successfully`);
  } catch (error) {
    UIManager.showError(error.message);
  }
}

document.getElementById('fillForm').addEventListener('click', () => {
  executeContentScript('autofill');
});

document.getElementById('saveData').addEventListener('click', () => {
  executeContentScript('save');
});
