const sharp = require('sharp');
const path = require('path');

async function fixLogo() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo-green-v2.png');
  const outputPath = path.join(__dirname, '..', 'public', 'logo-icon-white.png');

  try {
    // 1. Load the JPEG-pretending-to-be-PNG file
    const image = sharp(inputPath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const outputData = Buffer.alloc(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];
      
      const isWhite = r > 245 && g > 245 && b > 245;
      const isBottomPart = (Math.floor(i / width) > height * 0.6); // Remove text at bottom

      if (isWhite || isBottomPart) {
        outputData[i * 4] = 255;
        outputData[i * 4 + 1] = 255;
        outputData[i * 4 + 2] = 255;
        outputData[i * 4 + 3] = 0; // Transparent
      } else {
        // Content pixels -> make them pure white
        outputData[i * 4] = 255;
        outputData[i * 4 + 1] = 255;
        outputData[i * 4 + 2] = 255;
        outputData[i * 4 + 3] = 255; // Opaque White
      }
    }

    // 2. Create the transparent-content-white image
    // 3. Extract the top part (cat face) - usually top 60%
    // 4. Trim any remaining transparency around it
    await sharp(outputData, { raw: { width, height, channels: 4 } })
      .trim()
      .png()
      .toFile(outputPath);

    console.log('Successfully created the final transparent icon!');
  } catch (err) {
    console.error('Error:', err);
  }
}

fixLogo();
