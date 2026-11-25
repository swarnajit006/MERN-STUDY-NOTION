// base styles
exports.baseStyles = () => `
  body {
    background-color: #f4f4f4;
    font-family: Arial, sans-serif;
  }

  .container {
    max-width: 600px;
    margin: 40px auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  }

  .button {
    display: inline-block;
    background: #facc15;
    padding: 12px 20px;
    border-radius: 6px;
    text-decoration: none;
    color: black;
    font-weight: bold;
    margin-top: 20px;
  }
`;

// logo
exports.logo = () => `
  <img src="https://i.ibb.co/7Xyj3PC/logo.png" width="120" />
`;

// footer
exports.footer = () => `
  <p style="margin-top: 30px; font-size: 13px;">
    Need help? Contact 
    <a href="mailto:info@studynotion.com">info@studynotion.com</a>
  </p>
`;