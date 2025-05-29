/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",  // ← JavaScript/React対応。content 配列は、Tailwindがクラス名をスキャンする対象を指定します。JavaScript（.js や .jsx）を使うなら、これが重要です。
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

