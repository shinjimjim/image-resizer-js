const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 公開フォルダ設定（React のビルド後ファイル）
app.use(express.static(path.join(__dirname, '../build')));

// sitemap.xml を application/xml で返す
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// SPA のため、ルートは build/index.html を返す
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log(`✅ Express サーバー起動中: http://localhost:${port}`);
});
