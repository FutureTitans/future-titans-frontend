export function stripMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{3}(.*?)_{3}/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n');
}
