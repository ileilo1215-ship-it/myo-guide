const sharp = require('sharp');
const path = require('path');

async function makeTransparent() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo-green-v2.png');
  const outputPath = path.join(__dirname, '..', 'public', 'logo-transparent-white.png');

  try {
    // We want to:
    // 1. Load the image
    // 2. Turn all "white-ish" pixels into transparent
    // 3. Turn all other pixels into pure white
    // 4. Save as a new file
    
    const { data, info } = await sharp(inputPath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const outputData = Buffer.alloc(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];
      
      // If pixel is white-ish (R, G, B > 240)
      if (r > 240 && g > 240 && b > 240) {
        outputData[i * 4] = 255;
        outputData[i * 4 + 1] = 255;
        outputData[i * 4 + 2] = 255;
        outputData[i * 4 + 3] = 0; // Transparent
      } else {
        // Make it white for the footer
        outputData[i * 4] = 255;
        outputData[i * 4 + 1] = 255;
        outputData[i * 4 + 2] = 255;
        outputData[i * 4 + 3] = 255; // Opaque white
      }
    }

    await sharp(outputData, { raw: { width, height, channels: 4 } })
      .png()
      .toFile(outputPath);

    console.log('Successfully created transparent white logo!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

makeTransparent();
