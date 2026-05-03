exports.passwordUpdated = (email, name) => {
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

      <h2>Password Updated</h2>

      <p>Hey <b>${name}</b>,</p>

      <p>
        Your password has been successfully updated for 
        <b>${email}</b>.
      </p>

      <p>If this wasn't you, contact support immediately.</p>

      ${footer()}

    </div>
  </body>
  </html>
  `;
};