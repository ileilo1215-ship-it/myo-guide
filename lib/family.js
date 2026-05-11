import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const familyDirectory = path.join(process.cwd(), 'content/family');

export function getFamilyData() {
  if (!fs.existsSync(familyDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(familyDirectory);
  const allFamilyData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(familyDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // Check if at least one image exists
      const imagePath = matterResult.data.images?.[0];
      const hasImage = imagePath && fs.existsSync(path.join(process.cwd(), 'public', imagePath));

      return {
        slug,
        hasImage,
        ...matterResult.data,
        content: matterResult.content,
      };
    });

  // Sort: 1. Members with images first, 2. Sort by date (newest first), 3. Sort by name
  return allFamilyData.sort((a, b) => {
    // Priority 1: Has Image
    if (a.hasImage && !b.hasImage) return -1;
    if (!a.hasImage && b.hasImage) return 1;

    // Priority 2: Date (Newest first)
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    if (a.date) return -1;
    if (b.date) return 1;

    // Priority 3: Name
    return a.name.localeCompare(b.name);
  });
}

export async function getFamilyMember(slug) {
  const fullPath = path.join(familyDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...matterResult.data,
  };
}
