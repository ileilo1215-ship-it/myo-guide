const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function fixLogo(inputPath, outputPath) {
    const fullInputPath = path.resolve(inputPath);
    const fullOutputPath = path.resolve(outputPath);

    if (!fs.existsSync(fullInputPath)) {
        console.log(`File not found: ${fullInputPath}`);
        return;
    }

    console.log(`Processing ${inputPath}...`);
    try {
        const image = await Jimp.read(fullInputPath);
        const { width, height } = image.bitmap;

        // Target background color #F8F5F0
        const targetR = 248;
        const targetG = 245;
        const targetB = 240;

        image.scan(0, 0, width, height, function(x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const a = this.bitmap.data[idx + 3];

            const intensity = (r + g + b) / 3;

            // If it's a light pixel (part of the grid or white background)
            if (intensity > 180 || a < 100) {
                this.bitmap.data[idx + 0] = targetR;
                this.bitmap.data[idx + 1] = targetG;
                this.bitmap.data[idx + 2] = targetB;
                this.bitmap.data[idx + 3] = 255; // Make it opaque
            } else {
                // Keep it as is (likely the dark logo part)
                // But ensure it's opaque to avoid grid showing through semi-transparency
                this.bitmap.data[idx + 3] = 255;
            }
        });

        await image.write(fullOutputPath);
        console.log(`Saved fixed logo to ${outputPath}`);
    } catch (err) {
        console.error(`Error processing ${inputPath}:`, err);
    }
}

async function run() {
    await fixLogo('public/logo-v3.png', 'public/logo-v3-fixed.png');
    await fixLogo('public/logo-v3-compressed.png', 'public/logo-v3-compressed-fixed.png');
}

run();
