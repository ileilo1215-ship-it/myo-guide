const { Jimp } = require('jimp');

async function checkImage() {
    try {
        const image = await Jimp.read('public/logo-v3.png');
        // Resize to 600px width
        image.resize({ w: 600 });
        
        // Save with compression
        await image.write('public/logo-v3-compressed.png');
        console.log('Compressed image (600px) saved as public/logo-v3-compressed.png');
    } catch (err) {
        console.error(err);
    }
}

checkImage();
