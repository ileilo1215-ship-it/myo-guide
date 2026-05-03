const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../posts');
const files = fs.readdirSync(postsDir);

for (const file of files) {
  if (file.endsWith('.txt')) {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace unsplash URLs to ensure they load correctly.
    content = content.replace(/image:\s*"https:\/\/images\.unsplash\.com\/photo-([^"?]+)[^"]*"/g, 'image: "https://images.unsplash.com/photo-$1?q=80&w=800&auto=format&fit=crop"');
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log('Fixed image URLs in all posts.');
