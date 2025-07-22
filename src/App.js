import React, { useState, useRef } from 'react'; //React の基本ライブラリを読み込みます。
import { Helmet } from 'react-helmet';
//useState は「状態（state）」を管理するための React の関数（フック）です。これは、関数コンポーネント内で状態（変数のようなもの）を保持・更新できるようにする仕組みです。
//useRef：画像サイズ取得用に画像をDOMに直接アクセスするために使用。

//React の「コンポーネント」と呼ばれる関数を定義しています。App はトップレベルの画面（メインUI）を表します。
function App() {
  //useState(null)：初期値を null に設定（最初は画像がない）。更新すると自動的に再レンダリング（Reactが画面を更新）されます。
  const [imageSrc, setImageSrc] = useState(null); //imageSrc：アップロードされた画像（Base64）のURL（DataURL）を保存する状態変数。setImageSrc はその状態を更新するための関数。
  const [resizedImage, setResizedImage] = useState(null); //resizedImage：リサイズ後の画像のURL（Base64）
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState(''); //width / height：リサイズ時に入力するサイズ
  const [format, setFormat] = useState('image/png'); // 出力形式
  const [fileName, setFileName] = useState('resized-image'); //保存時のファイル名（拡張子なし）
  const [originalWidth, setOriginalWidth] = useState(null);
  const [originalHeight, setOriginalHeight] = useState(null); //元画像のサイズ（読み込み時に取得）
  const [keepAspectRatio, setKeepAspectRatio] = useState(true); //アスペクト比固定 ON/OFF のスイッチ
  const [quality, setQuality] = useState(0.92); // デフォルト品質（ブラウザ標準）quality：JPEG/WebPの場合の画質。
  const [resizedSize, setResizedSize] = useState(null); // 圧縮後のファイルサイズ（バイト数を保持）

  const originalImageRef = useRef(null); //useRef：直接画像DOM要素にアクセスしたいときに使用。

  //画像ファイルの読み込み処理
  const handleFileChange = (e) => { //画像ファイルが選ばれたときに呼ばれる関数。
    const file = e.target.files?.[0]; //e.target.files[0]で選ばれた最初のファイルを取得。.files?.[0]の ?. は、もしfilesが存在しなければエラーにならずundefinedを返す「オプショナルチェーン」。
    if (!file) return;

    //FileReader：Web API。画像ファイルを「Base64形式のURL（Data URL）」として読み込めます。これにより画像を <img src="..."> で表示できるようになります。
    const reader = new FileReader();
    //ファイルの読み込みが完了したときに呼ばれる処理です。画像を読み込み、読み込まれた画像の元サイズ（幅/高さ）を取得。アスペクト比の元になる値として使います。
    reader.onload = () => {
      const image = new Image(); //new Image() を使って元画像の幅・高さを取得し、入力欄に初期表示
      image.src = reader.result;
      image.onload = () => {
        setOriginalWidth(image.width);
        setOriginalHeight(image.height);
        setWidth(image.width);
        setHeight(image.height);
      };
      setImageSrc(reader.result); //reader.result は Base64形式の画像データ（Data URL）で、imageSrc に保存します。
      setResizedImage(null); // 新しい画像を選んだら前の結果はリセット
    };
    //ファイルをBase64形式のURLに変換して読み込みます。
    reader.readAsDataURL(file);
  };

  //幅・高さ入力とアスペクト比の維持
  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);

    if (keepAspectRatio && originalWidth && originalHeight) { //keepAspectRatio が true のとき、片方を変更するともう片方を自動計算
      const aspectRatio = originalHeight / originalWidth; //height / width を使って元の縦横比を保つ
      setHeight(Math.round(newWidth * aspectRatio)); //ユーザーが幅だけ入力した場合、高さをアスペクト比から自動計算します。
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setHeight(newHeight);

    if (keepAspectRatio && originalWidth && originalHeight) {
      const aspectRatio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * aspectRatio)); //逆に高さを入力した場合も同様に、幅を自動計算します。
    }
  };

  // 画像をリサイズする関数
  //<canvas> は HTML5 の描画領域：画像処理・描画・ゲームに広く使われる。
  const handleResize = () => {
    if (!imageSrc || !width || !height) return;

    const img = new Image(); //Image オブジェクトに元画像を読み込み
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas'); //<canvas> を使って新しいサイズで描画し、指定サイズでスケーリング
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);

      const ctx = canvas.getContext('2d'); //canvas.getContext("2d")：2DグラフィックスAPIを取得（ペンのような役割）
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //画像を指定サイズで描画（スケーリング）

      const resizedDataUrl = format === 'image/jpeg'
        ? canvas.toDataURL(format, quality) // 品質適用
        : canvas.toDataURL(format); //canvas.toDataURL()：canvas上の画像をBase64に変換（→再び<img>に使える）再エンコードして結果を取得

      setResizedImage(resizedDataUrl);

      // base64 からファイルサイズ（バイト数）を計算
      const base64Length = resizedDataUrl.length - resizedDataUrl.indexOf(',') - 1;
      const fileSizeBytes = Math.ceil(base64Length * 3 / 4); // Base64 → バイト数
      setResizedSize(fileSizeBytes);
    };
  };

  //拡張子判定ロジック
  const getExtension = () => {
    switch (format) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/webp':
        return 'webp';
      default:
        return 'png';
    }
  };

  //JSX（HTMLに似たReactの構文）で、画面に表示する内容を定義しています。
  return (
    <div className="p-6 max-w-md mx-auto"> {/*全体を囲むボックス。Tailwind CSSで余白（p-6）・最大幅（max-w-md）・中央寄せ（mx-auto）を指定。*/}
      <Helmet>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4576810240385912"
          crossorigin="anonymous"></script>
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">画像アップロード ＆ リサイズ</h1> {/*タイトル。文字サイズ（text-2xl）、太字（font-bold）、下マージン（mb-4）。*/}

      {/* ファイル選択 */}{/*accept="image/*" で画像だけ選べるようにしています。onChange={handleFileChange} で画像が選ばれたときに関数が呼ばれます。*/}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border rounded px-3 py-2"
      />

      {/* オリジナル画像の表示 */}{/*画像が選ばれた場合（imageSrcがあるとき）だけ<img>を表示。src={imageSrc}で表示する画像のURLを指定。Tailwind CSSで画像の最大幅・角丸・影を指定。*/}
                                             {/*imageSrc が null でなければ <div>...</div> を表示するという意味。JavaScriptの論理AND (&&) を利用した「条件レンダリング」。*/}
      {imageSrc && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">アップロード画像</h2>
          {/*src に Base64 URL を指定すればブラウザに画像が表示されます。alt：画像が表示できないときに表示されるテキスト（アクセシビリティ向上）。className には Tailwind CSS を利用*/}
          {/*max-w-full：親要素の幅に収まるように。h-auto：高さは自動調整（縦横比を保持）。rounded：角丸。shadow：ドロップシャドウ（影）*/}
          <img
            src={imageSrc}
            alt="Uploaded"
            className="mt-4 max-w-full h-auto rounded shadow"
          />
        </div>
      )}

      {/* 幅と高さの入力 + リサイズボタン */}
      {imageSrc && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="mt-4 flex gap-2 items-center">
            {/*ユーザーが数字を入力できる <input type="number">。onChange で状態を更新 → 入力した数字が width に反映。入力した値は parseInt(width) で整数に変換して使います*/}
            <input
              type="number"
              placeholder="幅(px)"
              value={width}
              onChange={handleWidthChange}
              className="border px-2 py-1 rounded w-24"
            />
            <input
              type="number"
              placeholder="高さ(px)"
              value={height}
              onChange={handleHeightChange}
              className="border px-2 py-1 rounded w-24"
            />

            {/*出力形式（PNG, JPEG, WebP）*/}
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>

            {/*リサイズボタン*/}
            <button onClick={handleResize} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">リサイズ</button> {/*押したら handleResize を実行して画像を再描画*/}
          </div>

          {/*アスペクト比固定スイッチ*/}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={keepAspectRatio}
              onChange={() => setKeepAspectRatio(!keepAspectRatio)}
              id="aspectRatioToggle"
            /> {/*状態は keepAspectRatio に保存され、幅・高さ入力時に反映される*/}
            <label htmlFor="aspectRatioToggle" className="text-sm">
              アスペクト比を固定する
            </label>
          </div>

          {/* JPEG選択時のみスライダー表示 */}
          {format === 'image/jpeg' && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                JPEG品質: {quality}
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* リサイズ後の画像の表示 */}
      {/*リサイズされた画像は再度 <img src="..." /> で表示。元画像とまったく同じ方法で描画されるが、中身は <canvas> を通じて変形されたもの。*/}
      {resizedImage && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">リサイズ後の画像</h2>
          <img
            src={resizedImage}
            alt="Resized"
            className="max-w-full h-auto rounded shadow"
          />

          {/*ファイル名の入力*/}
          <div className="mt-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border px-3 py-1 rounded w-full"
              placeholder="保存ファイル名（拡張子なし）"
            />

            {/*「圧縮後の画像ファイルサイズ（KB/MB）」を表示*/}
            <p className="mt-2 text-sm text-gray-700">
              ファイルサイズ: {(resizedSize / 1024).toFixed(2)} KB（{(resizedSize / 1024 / 1024).toFixed(2)} MB）
            </p>

            {/*ダウンロードリンク*/}
            <a href={resizedImage} download={`${fileName}.${getExtension()}`}>
              <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">画像をダウンロード</button>
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-center text-gray-600">
        <p>
          <a href="/about.html" className="mx-2 underline">このサイトについて</a>
          <a href="/guide.html" className="mx-2 underline">使い方</a>
          <a href="/faq.html" className="mx-2 underline">Q&A</a>
          <a href="/privacy.html" className="mx-2 underline">プライバシーポリシー</a>
          <a href="/terms.html" className="mx-2 underline">利用規約</a>
          <a href="/contact.html" className="mx-2 underline">お問い合わせ</a>
        </p>
      </div>
    </div>
  );
}

export default App;
