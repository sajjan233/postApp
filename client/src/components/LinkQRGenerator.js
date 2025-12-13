import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode.react";
import "./LinkQRGenerator.css";

const LinkQRGenerator = ({ onClose, referralCode }) => { // referralCode prop added
  const [link, setLink] = useState("");
  const [finalLink, setFinalLink] = useState("");
  const qrRef = useRef(null);

  // 🔹 Update finalLink automatically when link or referralCode changes
  useEffect(() => {
    if (!link) return;

    try {
      const url = new URL(link);

      if (referralCode) {
        url.searchParams.set("ref", referralCode); // add referral code
      }else{
   const user = JSON.parse(localStorage.getItem('user') || '{}');

        url.searchParams.set("ref", user.referralCode); // add referral code

      }

      setFinalLink(url.toString());
    } catch (err) {
      // If user pastes non-URL text, just attach as query string
      setFinalLink(referralCode ? `${link}?ref=${referralCode}` : link);
    }
  }, [link, referralCode]);

  const handleGenerate = () => {
    if (!finalLink) return;

    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <h2>Generate QR Code</h2>
          <button className="qr-close" onClick={onClose}>×</button>
        </div>

        <input
          type="text"
          placeholder="Paste App / PlayStore / Website Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="qr-input"
        />

        <button className="btn btn-primary qr-btn" onClick={handleGenerate}>
          Generate & Download QR
        </button>

        {/* hidden canvas */}
        {finalLink && (
          <div ref={qrRef} style={{ display: "none" }}>
            <QRCode
              value={finalLink}   // finalLink includes referralCode
              size={300}
              level="H"
              includeMargin={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkQRGenerator;
