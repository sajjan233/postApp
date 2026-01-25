import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import "./LinkQRGenerator.css";

const LinkQRGenerator = ({ onClose, referralCode }) => {
  const qrRef = useRef(null);
  const [finalLink, setFinalLink] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    let baseLink = "https://post24.in/connect";
    let ref = referralCode;
    let userName = "";

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!ref) ref = user.referralCode;
    if (!userName) userName = user.name;

    if (ref) baseLink = `${baseLink}?ref=${ref}`;
    setUsername(userName);
    setFinalLink(baseLink);
  }, [referralCode]);

  const handleGenerate = () => {
    if (!finalLink) return;
    const canvas = qrRef.current.querySelector("canvas");
    const paddingTop = 50;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height + paddingTop;
    const newCtx = newCanvas.getContext("2d");

    newCtx.fillStyle = "#fff";
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    newCtx.fillStyle = "#333";
    newCtx.font = "bold 22px Arial";
    newCtx.textAlign = "center";
    newCtx.fillText(username || "Post24 User", newCanvas.width / 2, 30);

    newCtx.drawImage(canvas, 0, paddingTop);

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

  const handleCopyLink = () => {
    if (!finalLink) return;
    navigator.clipboard.writeText(finalLink);
    alert("Referral link copied!");
  };

  const handleShareWhatsApp = () => {
    if (!finalLink) return;
    const text = `Install Post24 App using my referral link: ${finalLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareTelegram = () => {
    if (!finalLink) return;
    const text = `Install Post24 App using my referral link: ${finalLink}`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(finalLink)}&text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <h2>Referral QR & Link</h2>
          <button className="qr-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="qr-link-section">
          <input type="text" readOnly value={finalLink} />
          <button className="btn btn-copy" onClick={handleCopyLink}>
            📋 Copy Link
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="qr-share-buttons">
          <button className="btn btn-whatsapp" onClick={handleShareWhatsApp}>
            💬 Share on WhatsApp
          </button>
          <button className="btn btn-telegram" onClick={handleShareTelegram}>
            ✈️ Share on Telegram
          </button>
        </div>

        {/* Download QR */}
        <button className="btn btn-download" onClick={handleGenerate}>
          📥 Download QR
        </button>

        {/* Hidden QR */}
        {finalLink && (
          <div ref={qrRef} style={{ display: "none" }}>
            <QRCode value={finalLink} size={300} level="H" includeMargin={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkQRGenerator;
