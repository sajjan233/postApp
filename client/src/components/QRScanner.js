import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { customerAPI, adminAPI } from '../api';
import './QRScanner.css';

const QRScanner = ({ onAdminSelected, onBack }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    const scannerElement = scannerRef.current;
    if (!scannerElement) return;

    let isMounted = true;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScannerRef.current = html5QrcodeScanner;

    html5QrcodeScanner.render(
      async (decodedText) => {
        if (loading || !isMounted) return;
        
        setLoading(true);
        setError(null);

        try {
          const adminKey = decodedText;
          
          // Get admin by key
          const response = await adminAPI.getByKey(adminKey);
          const admin = response.data.admin;

          // Get or create customer ID
          let customerId = localStorage.getItem('customerId');
          if (!customerId) {
            customerId = `customer_${Date.now()}`;
            localStorage.setItem('customerId', customerId);
          }

          // Select admin
          await customerAPI.selectAdmin({
            customerId,
            adminKey: admin.adminKey
          });

          // Stop scanner
          if (html5QrcodeScannerRef.current) {
            html5QrcodeScannerRef.current.clear();
          }

          if (isMounted) {
            onAdminSelected({
              id: admin.id,
              name: admin.name,
              shopName: admin.shopName,
              adminKey: admin.adminKey
            });
          }
        } catch (err) {
          if (isMounted) {
            setError(err.response?.data?.message || 'Failed to scan QR code. Please try again.');
            setLoading(false);
          }
        }
      },
      (errorMessage) => {
        // Ignore scan errors, they're frequent during scanning
      }
    );

    return () => {
      isMounted = false;
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
        html5QrcodeScannerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="qr-scanner">
      <div className="qr-scanner-container">
        <button className="back-btn" onClick={onBack}>← Back</button>
        
        <h2>Scan QR Code</h2>
        <p>Point your camera at the QR code</p>

        {error && <div className="error">{error}</div>}

        <div ref={scannerRef} id="qr-reader" className="scanner-wrapper"></div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

