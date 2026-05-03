const Jimp = require('jimp');

Jimp.read('../public/logo.png')
  .then(image => {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      var red   = this.bitmap.data[idx + 0];
      var green = this.bitmap.data[idx + 1];
      var blue  = this.bitmap.data[idx + 2];
      var alpha = this.bitmap.data[idx + 3];

      // If white background, change to F8F5F0
      if (red > 240 && green > 240 && blue > 240 && alpha > 200) {
        this.bitmap.data[idx + 0] = 248;
        this.bitmap.data[idx + 1] = 245;
        this.bitmap.data[idx + 2] = 240;
      }
      // If orange, change to Terracotta (R196 G98 B45)
      if (red > 150 && green < 200 && blue < 100 && alpha > 50) {
        this.bitmap.data[idx + 0] = 196;
        this.bitmap.data[idx + 1] = 98;
        this.bitmap.data[idx + 2] = 45;
      }
    });
    return image.writeAsync('../public/logo.png');
  })
  .then(() => console.log('Logo updated!'))
  .catch(err => console.error(err));
