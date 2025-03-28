# Medical Billing Assistant Chrome Extension

A secure Chrome extension for automating medical billing data entry on OfficeAlly and similar platforms.

## Features

- Secure data encryption using AES-GCM
- Automatic form field detection and saving
- Data validation for medical billing fields
- Auto-fill functionality for saved data
- HIPAA-compliance focused security measures

## Project Structure

```
swiftbills/
├── manifest.json        # Extension configuration
├── popup.html          # Extension popup interface
├── popup.js            # Popup functionality
├── content.js          # Form interaction and encryption
├── background.js       # Background service worker
└── test.html          # Test form for development
```

## Security Features

- AES-GCM encryption for stored data
- Input sanitization to prevent XSS attacks
- Form field validation
- Content Security Policy implementation

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked" and select the project directory

## Usage

1. Navigate to a medical billing form
2. Fill out the form fields:
   - Date of Service (MM/DD/YYYY)
   - NDC Code (11 digits)
   - CPT/HCPCS Code (5 digits)
3. Data is automatically encrypted and saved
4. Click the extension icon to:
   - Auto-fill saved data
   - Manually save current form data

## Development

### Testing
- Use `test.html` for local development
- Chrome DevTools for debugging:
  - Popup: Right-click extension icon → "Inspect popup"
  - Background: Click "service worker" in chrome://extensions
  - Content: Standard page inspection (F12)

### Validation Rules
- Date format: MM/DD/YYYY
- NDC Code: 11 digits
- CPT/HCPCS: 5 digits

## Security Considerations

- All stored data is encrypted using the WebCrypto API
- No external network requests
- Input sanitization for all form fields
- Strict Content Security Policy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License
