// Utility function to generate QR code data URL
// This can be used in admin dashboard to display QR code

export const generateQRData = (adminKey) => {
  // Return the adminKey as a string that can be used with QR code libraries
  return adminKey;
};

// Example usage with qrcode.react library:
// import QRCode from 'qrcode.react';
// <QRCode value={generateQRData(admin.adminKey)} size={200} />


