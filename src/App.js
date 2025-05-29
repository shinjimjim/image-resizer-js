import React, { useState } from 'react'; //React の基本ライブラリを読み込みます。useState は「状態（state）」を管理するための React の関数（フック）です。

//React の「コンポーネント」と呼ばれる関数を定義しています。App はトップレベルの画面（メインUI）を表します。
function App() {
  //imageSrc：表示する画像のURL（DataURL）を保存する状態変数。useState(null)：初期値を null に設定（最初は画像がない）。setImageSrc を呼び出すことで画像を更新できる。
  const [imageSrc, setImageSrc] = useState(null);

  //画像ファイルが選ばれたときに呼ばれる関数。e.target.files[0]で選ばれた最初のファイルを取得する。.files?.[0]の ?. は、もしfilesが存在しなければエラーにならずundefinedを返す「オプショナルチェーン」。
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //JavaScriptの FileReader を使って画像ファイルを読み込みます。
    const reader = new FileReader();
    //ファイルの読み込みが完了したときに呼ばれる処理です。reader.result は Base64形式の画像データ（Data URL）で、imageSrc に保存します。
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    //ファイルをBase64形式のURLに変換して読み込みます。
    reader.readAsDataURL(file);
  };

  //JSX（HTMLに似たReactの構文）で、画面に表示する内容を定義しています。
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">画像アップロード＆表示</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border rounded px-3 py-2"
      />
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Uploaded"
          className="mt-4 max-w-full h-auto rounded shadow"
        />
      )}
    </div>
  );
  //<div className="p-6 max-w-md mx-auto">：全体を囲むボックス。Tailwind CSSで余白（p-6）・最大幅（max-w-md）・中央寄せ（mx-auto）を指定。
  //<h1 className="text-2xl font-bold mb-4">画像アップロード＆表示</h1>：タイトル。文字サイズ（text-2xl）、太字（font-bold）、下マージン（mb-4）。
  //<input type="file" ... />：ファイル選択用のボタン。accept="image/*" で画像だけ選べるようにしています。onChange={handleFileChange} で画像が選ばれたときに関数が呼ばれます。
  //{imageSrc && (<img ... />)}：画像が選ばれた場合（imageSrcがあるとき）だけ<img>を表示。src={imageSrc}で表示する画像のURLを指定。Tailwind CSSで画像の最大幅・角丸・影を指定。
}

export default App;
