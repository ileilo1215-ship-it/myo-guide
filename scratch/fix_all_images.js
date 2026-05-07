const fs = require('fs');
const path = require('path');

const validImages = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529778456209-41712a201b1c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=800&auto=format&fit=crop"
];

const postsDir = path.join(__dirname, '../posts');
const files = fs.readdirSync(postsDir);

let imgIdx = 0;
for (const file of files) {
  if (file.endsWith('.txt')) {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    content = content.replace(/image:\s*"https:\/\/images\.unsplash\.com\/photo-[^"]*"/g, `image: "${validImages[imgIdx % validImages.length]}"`);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    imgIdx++;
  }
}
console.log('Fixed broken image URLs in all posts with reliable fallbacks.');
