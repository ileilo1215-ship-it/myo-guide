import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  let fileNames = [];
  try {
    fileNames = fs.readdirSync(postsDirectory);
  } catch (err) {
    console.error('Failed to read posts directory', err);
    return [];
  }
  
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.(txt|md)$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
      content: matterResult.content,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.(txt|md)$/, ''),
    };
  });
}

export async function getPostData(id) {
  // id가 URL 인코딩되어 넘어올 수 있으므로 (예: %20) 디코딩합니다.
  const decodedId = decodeURIComponent(id);
  
  // .txt 또는 .md 파일을 순차적으로 확인합니다.
  let fullPath = path.join(postsDirectory, `${decodedId}.txt`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${decodedId}.md`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id: decodedId,
    contentHtml,
    content: matterResult.content,
    ...matterResult.data,
  };
}
