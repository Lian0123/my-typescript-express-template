'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const docsRoot = path.join(root, 'docs', 'AI 維護');
const requiredFiles = [
  '入口.md',
  '讀取策略/漸進式讀取.md',
  '重點記憶/專案事實.md',
  '重點記憶/風險與技術債.md',
  '處理思路/變更決策流程.md',
  '快速定位/功能總索引.md',
  '任務處理/任務工作流.md',
  '安裝與配置索引.md',
  '開發規範索引.md',
  '測試與驗證索引.md',
  '文件生成索引.md',
  '異動記錄/日誌索引.md',
  '異動記錄/CHANGELOG.md',
  '外部參考/參考索引.md',
];

const errors = [];

const walkMarkdown = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkMarkdown(target);
    return entry.isFile() && entry.name.endsWith('.md') ? [target] : [];
  });

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(docsRoot, relativePath))) {
    errors.push(`缺少必要文件：${relativePath}`);
  }
}

if (fs.existsSync(docsRoot)) {
  for (const file of walkMarkdown(docsRoot)) {
    const content = fs.readFileSync(file, 'utf8');
    const relativeFile = path.relative(root, file);
    const firstLine = content.split(/\r?\n/, 1)[0];
    if (!/^<!-- AI-DOC: owner=.+; verified=\d{4}-\d{2}-\d{2}; sources=.+ -->$/.test(firstLine)) {
      errors.push(`metadata 格式錯誤：${relativeFile}`);
    }

    const links = content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
    for (const match of links) {
      const href = match[1].trim().replace(/^<|>$/g, '');
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const withoutAnchor = href.split('#')[0];
      if (!withoutAnchor) continue;
      let decoded;
      try {
        decoded = decodeURIComponent(withoutAnchor);
      } catch (_error) {
        errors.push(`無法解碼連結：${relativeFile} -> ${href}`);
        continue;
      }
      if (!fs.existsSync(path.resolve(path.dirname(file), decoded))) {
        errors.push(`失效本地連結：${relativeFile} -> ${href}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`AI 文件驗證失敗（${errors.length} 項）：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`AI 文件驗證通過：${walkMarkdown(docsRoot).length} 份 Markdown 文件。`);
