import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import "./LinkQRGenerator.css";

const LinkQRGenerator = ({ onClose, referralCode }) => {
  const qrRef = useRef(null);
  const [finalLink, setFinalLink] = useState("");
  const [username, setusername] = useState("");

  // 🔹 Generate static link with referral code
  useEffect(() => {
    let baseLink = "http://post24.in/connect";

    let ref = referralCode;
    let userName = ''
    if (!ref) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      ref = user.referralCode;
      userName = user.name
    }
       
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userName = user.name
    

    if (ref) {
      baseLink = `${baseLink}?ref=${ref}`;
    }
    
    setusername(userName)
    setFinalLink(baseLink);
  }, [referralCode]);

  // 🔹 Direct QR download on button click
  const handleGenerate = () => {
    if (!finalLink) return;

    const canvas = qrRef.current.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // 👉 Create new canvas (extra space for name)
    const paddingTop = 50;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height + paddingTop;

    const newCtx = newCanvas.getContext("2d");

    // White background
    newCtx.fillStyle = "#fff";
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw username text
    newCtx.fillStyle = "#000";
    newCtx.font = "bold 22px Arial";
    newCtx.textAlign = "center";
    newCtx.fillText(username || "Post24 User", newCanvas.width / 2, 30);

    // Draw QR code
    newCtx.drawImage(canvas, 0, paddingTop);

    // Download
    const pngUrl = newCanvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "post24-QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };


  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <h2>Download Referral QR</h2>
          <button className="qr-close" onClick={onClose}>×</button>
        </div>



        <button className="btn btn-primary qr-btn" onClick={handleGenerate}>
          <h3>Download</h3>
        </button>

        {/* Hidden QR canvas */}
        {finalLink && (
          <div ref={qrRef} style={{ display: "none" }}>
            <QRCode
              value={finalLink}
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
