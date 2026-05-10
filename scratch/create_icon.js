const sharp = require('sharp');
const path = require('path');

async function createIcon() {
  const inputPath = path.join(__dirname, '..', 'public', 'logo-green-v2.png');
  const outputPath = path.join(__dirname, '..', 'public', 'logo-icon-white.png');

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Most logos of this type have the icon in the top ~60% of the image
    // Let's crop the top part and also make it white/transparent
    
    const width = metadata.width;
    const height = Math.floor(metadata.height * 0.65); // Just the cat face part

    const { data, info } = await image
      .extract({ left: 0, top: 0, width: metadata.width, height: height })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const outputData = Buffer.alloc(info.width * info.height * 4);

    for (let i = 0; i < info.width * info.height; i++) {
      const r = data[i * info.channels];
      const g = data[i * info.channels + 1];
      const b = data[i * info.channels + 2];
      
      // If pixel is white-ish (R, G, B > 240)
      if (r > 240 && g > 240 && b > 240) {
        outputData[i * 4] = 255;
        outputData[i * 4 + 1] = 255;
        outputData[i * 4 + 2] = 255;
        outputData[i * 4 + 3] = 0; // Transparent
      } else {
        // Make it white
        outputData[i * 4] = 255;
        outputData[i * 4 + 1] = 255;
        outputData[i * 4 + 2] = 255;
        outputData[i * 4 + 3] = 255; // Opaque white
      }
    }

    await sharp(outputData, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim() // Trim any remaining transparency to center it
      .png()
      .toFile(outputPath);

    console.log('Successfully created transparent white icon!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

createIcon();
