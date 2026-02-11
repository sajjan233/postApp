import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRCodeDisplay.css';

const QRCodeDisplay = ({ adminKey, shopName }) => {
  const [showModal, setShowModal] = useState(false);

  if (!adminKey) {
    return null;
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Show My QR Code
      </button>

      {showModal && (
        <div className="qr-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Your QR Code</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="qr-code-container">
              <QRCodeSVG value={adminKey} size={256} />
              <p className="qr-shop-name">{shopName || 'Admin'}</p>
              <p className="qr-hint">Customers can scan this to connect to your shop</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeDisplay;


