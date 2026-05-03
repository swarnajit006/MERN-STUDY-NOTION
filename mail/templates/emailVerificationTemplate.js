exports.emailVerificationTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      ${baseStyles()}
    </style>
  </head>
  <body>
    <div class="container">

      ${logo()}

      <h2>Email Verification</h2>

      <p>Your OTP is:</p>

      <h1 style="letter-spacing: 3px;">${otp}</h1>

      <p>This OTP is valid for 5 minutes.</p>

      ${footer()}

    </div>
  </body>
  </html>
  `;
};