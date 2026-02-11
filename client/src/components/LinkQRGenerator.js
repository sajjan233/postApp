import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode.react";
import "./LinkQRGenerator.css";

const LinkQRGenerator = ({ onClose, referralCode }) => {
  const qrRef = useRef(null);
  const [finalLink, setFinalLink] = useState("");
  const [username, setUsername] = useState("");
const [shopName, setShopName] = useState("");
useEffect(() => {
  let baseLink = "https://post24.in/connect";
  let ref = referralCode;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!ref) ref = user.referralCode;

  if (ref) baseLink = `${baseLink}?ref=${ref}`;

  setShopName(user.shopName || "Post24 Partner");
  setFinalLink(baseLink);
}, [referralCode]);

const drawGradient = (ctx, x, y, w, h) => {
  const gradient = ctx.createLinearGradient(0, y, 0, y + h);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(1, "#764ba2");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
};

const handleGenerate = () => {
  if (!finalLink || !shopName) return;

  const qrCanvas = qrRef.current.querySelector("canvas");

  const width = 420;
  const height = 560;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  /* ===== BACKGROUND ===== */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  /* ===== HEADER ===== */
  drawGradient(ctx, 0, 0, width, 90);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Post24", width / 2, 42);

  ctx.font = "14px Arial";
  ctx.fillText("Available on Google Play", width / 2, 68);

  /* ===== SHOP NAME ===== */
  ctx.fillStyle = "#222";
  ctx.font = "bold 18px Arial";
  ctx.fillText(shopName, width / 2, 125);

  ctx.font = "14px Arial";
  ctx.fillStyle = "#666";
  ctx.fillText("Official Post24 Partner", width / 2, 145);

  /* ===== QR CARD SHADOW ===== */
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(55, 170, 310, 310);

  /* ===== QR CARD ===== */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(45, 160, 310, 310);

  ctx.drawImage(qrCanvas, 65, 180, 270, 270);

  /* ===== FOOTER ===== */
  drawGradient(ctx, 0, height - 70, width, 70);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Scan • Install from Play Store • Connect", width / 2, height - 40);

  /* ===== DOWNLOAD ===== */
  const pngUrl = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");

  const link = document.createElement("a");
  link.href = pngUrl;
  link.download = `${shopName}-Post24-QR.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
