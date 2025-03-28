class SecureDataHandler {
  static async encryptData(data) {
    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );
    
    return {
      encrypted: Array.from(new Uint8Array(encryptedData)),
      iv: Array.from(iv),
      key: await window.crypto.subtle.exportKey('jwk', key)
    };
  }

  static async decryptData(encryptedData) {
    const key = await window.crypto.subtle.importKey(
      'jwk',
      encryptedData.key,
      { name: 'AES-GCM', length: 256 },
      true,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      key,
      new Uint8Array(encryptedData.encrypted)
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  static validatePatientData(data) {
    const validators = {
      dateOfService: (date) => /^\d{2}\/\d{2}\/\d{4}$/.test(date),
      ndcCode: (code) => /^\d{11}$/.test(code),
      cptCode: (code) => /^\d{5}$/.test(code)
    };

    const errors = [];
    Object.entries(data).forEach(([field, value]) => {
      if (validators[field] && !validators[field](value)) {
        errors.push(`Invalid ${field}`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }
}

// Updated field mapping based on the screenshot
const fieldMap = {
  'dateOfService': 'input[name="Date Created"]',
  'patientName': 'input[name="Patient Name"]',
  'claimNo': 'input[name="Claim No"]',
  'formType': 'select[name="Form Type"]',
  'status': 'select[name="Status"]'
};

function sanitizeInput(input) {
  return input.replace(/[<>&'"]/g, '');
}

async function saveCurrentFormData() {
  const formData = {};
  Object.entries(fieldMap).forEach(([key, selector]) => {
    const element = document.querySelector(selector);
    if (element) {
      formData[key] = sanitizeInput(element.value);
    }
  });

  const validation = SecureDataHandler.validatePatientData(formData);
  if (validation.isValid) {
    const encryptedData = await SecureDataHandler.encryptData(formData);
    await chrome.storage.local.set({ 'patientData': encryptedData });
  } else {
    throw new Error(validation.errors.join(', '));
  }
}

async function autofillForm() {
  const data = await chrome.storage.local.get('patientData');
  if (data.patientData) {
    const decryptedData = await SecureDataHandler.decryptData(data.patientData);
    Object.entries(fieldMap).forEach(([key, selector]) => {
      const element = document.querySelector(selector);
      if (element && decryptedData[key]) {
        element.value = sanitizeInput(decryptedData[key]);
        element.dispatchEvent(new Event('change'));
      }
    });
  }
}

// Listen for custom events from popup
window.addEventListener('autofillForm', autofillForm);
window.addEventListener('saveFormData', saveCurrentFormData);

// Listen for form field changes
document.addEventListener('change', async (e) => {
  if (e.target.matches(Object.values(fieldMap).join(','))) {
    try {
      await saveCurrentFormData();
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }
});
