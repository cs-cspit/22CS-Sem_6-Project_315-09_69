export const otpEmailTemplate = (otp) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            text-align: center;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your OTP Code</h2>
          <p>Use the following OTP to proceed:</p>
          <p class="otp">${otp}</p>
          <p>This OTP is valid for a limited time. Do not share it with anyone.</p>
          <div class="footer">If you did not request this, please ignore this email.</div>
        </div>
      </body>
    </html>
  `;
};
