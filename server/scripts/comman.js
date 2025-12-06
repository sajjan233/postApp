const sharp = require("sharp");

 async function generateMobileImage({
  text,
  textColor,
  backgroundColor,
  fontSize,
  fontWeight,
  textAlign,
  outputPath
}) {

  const width = 1080;   // STATIC MOBILE WIDTH
  const height = 1920;  // STATIC MOBILE HEIGHT

  // Alignment handling
  const anchor = textAlign === "left" ? "start" :
                 textAlign === "right" ? "end" : "middle";

  const xPos = textAlign === "left" ? "5%" :
               textAlign === "right" ? "95%" : "50%";

  const svg = `
    <svg width="${width}" height="${height}">
      <style>
        .txt {
          fill: ${textColor};
          font-size: ${fontSize}px;
          font-weight: ${fontWeight};
          text-anchor: ${anchor};
          dominant-baseline: middle;
        }
      </style>

      <rect width="100%" height="100%" fill="${backgroundColor}" />

      <text x="${xPos}" y="50%" class="txt">${text}</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .toFile(outputPath);

  console.log("✔️ Mobile image created:", outputPath);
}


module.exports = {generateMobileImage}