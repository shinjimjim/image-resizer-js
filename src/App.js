import React, { useState } from 'react'; //React の基本ライブラリを読み込みます。
//useState は「状態（state）」を管理するための React の関数（フック）です。これは、関数コンポーネント内で状態（変数のようなもの）を保持・更新できるようにする仕組みです。

//React の「コンポーネント」と呼ばれる関数を定義しています。App はトップレベルの画面（メインUI）を表します。
function App() {
  //useState(null)：初期値を null に設定（最初は画像がない）。更新すると自動的に再レンダリング（Reactが画面を更新）されます。
  const [imageSrc, setImageSrc] = useState(null); //imageSrc：表示する画像のURL（DataURL）を保存する状態変数。setImageSrc はその状態を更新するための 関数。
  const [resizedImage, setResizedImage] = useState(null); //resizedImage：リサイズ後の画像のURL
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState(''); //width / height：リサイズ時に入力するサイズ

  //画像ファイルの読み込み処理
  const handleFileChange = (e) => { //画像ファイルが選ばれたときに呼ばれる関数。
    const file = e.target.files?.[0]; //e.target.files[0]で選ばれた最初のファイルを取得。.files?.[0]の ?. は、もしfilesが存在しなければエラーにならずundefinedを返す「オプショナルチェーン」。
    if (!file) return;

    //FileReader：Web API。画像ファイルを「Base64形式のURL（Data URL）」として読み込めます。これにより画像を <img src="..."> で表示できるようになります。
    const reader = new FileReader();
    //ファイルの読み込みが完了したときに呼ばれる処理です。
    reader.onload = () => {
      setImageSrc(reader.result); //reader.result は Base64形式の画像データ（Data URL）で、imageSrc に保存します。
      setResizedImage(null); // 新しい画像を選んだら前の結果はリセット
    };
    //ファイルをBase64形式のURLに変換して読み込みます。
    reader.readAsDataURL(file);
  };

  // 画像をリサイズする関数
  //<canvas> は HTML5 の描画領域：画像処理・描画・ゲームに広く使われる。
  const handleResize = () => {
    if (!imageSrc || !width || !height) return;

    const img = new Image(); //Image オブジェクトに元画像を読み込み
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas'); //<canvas> を使って新しいサイズで描画
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);

      const ctx = canvas.getContext('2d'); //canvas.getContext("2d")：2DグラフィックスAPIを取得（ペンのような役割）
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //画像を指定サイズで描画（スケーリング）

      const resizedDataUrl = canvas.toDataURL('image/png'); //canvas.toDataURL()：canvas上の画像をBase64に変換（→再び<img>に使える）再エンコードして結果を取得
      setResizedImage(resizedDataUrl);
    };
  };

  //JSX（HTMLに似たReactの構文）で、画面に表示する内容を定義しています。
  return (
    <div className="p-6 max-w-md mx-auto"> {/*全体を囲むボックス。Tailwind CSSで余白（p-6）・最大幅（max-w-md）・中央寄せ（mx-auto）を指定。*/}
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
        <div className="mt-4 flex gap-2 items-center">
          {/*ユーザーが数字を入力できる <input type="number">。onChange で状態を更新 → 入力した数字が width に反映。入力した値は parseInt(width) で整数に変換して使います*/}
          <input
            type="number"
            placeholder="幅(px)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="border px-2 py-1 rounded w-24"
          />
          <input
            type="number"
            placeholder="高さ(px)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border px-2 py-1 rounded w-24"
          />
          <button
            onClick={handleResize}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >リサイズ<
           /button> {/*押したら handleResize を実行して画像を再描画*/}
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
        </div>
      )}
    </div>
  );
}

export default App;
