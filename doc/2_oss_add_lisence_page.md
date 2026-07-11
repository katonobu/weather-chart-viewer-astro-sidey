Astroで作るWebサイトにOSSライセンス一覧（サードパーティ・ライセンス）のページを自動生成して組み込むのは、保守の手間を減らすためにも大正解の手法です！

JavaScript/TypeScriptエコシステムで定番の`license-checker-rseidelsohn`（または軽量な`license-checker`）というツールを使って、ビルド時に自動で一覧をJSONとして出力し、それをAstroのコンポーネントで読み込んで表示する方法が一番スマートです。

実装の流れをステップ・バイ・ステップで解説します。

---

## 実装の4ステップ

### 1. 必要なパッケージのインストール

まずはプロジェクトの依存関係（`package.json`など）からライセンス情報を抽出するツールを開発依存（devDependencies）としてインストールします。

```bash
npm install -D license-checker-rseidelsohn

```

### 2. ライセンス情報抽出スクリプトの作成

プロジェクトのルートディレクトリに、ビルド前にライセンス情報をJSONとして書き出すスクリプト（例: `gen-licenses.js`）を作成します。

```javascript
// gen-licenses.js
import checker from 'license-checker-rseidelsohn';
import fs from 'fs';
import path from 'path';

checker.init(
  {
    start: process.cwd(),
    json: true,
    // 必要に応じて、自分の自作パッケージや、ビルドに含めない devDependencies を除外
    production: true, 
  },
  function (err, packages) {
    if (err) {
      console.error('ライセンス情報の取得に失敗しました:', err);
      process.exit(1);
    } else {
      // Astroから読み込みやすいように src/data/ ディレクトリに保存する
      const outputDir = path.join(process.cwd(), 'src/data');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(outputDir, 'licenses.json'),
        JSON.stringify(packages, null, 2)
      );
      console.log('✅ licenses.json を正常に生成しました！');
    }
  }
);

```

### 3. package.json のスクリプトを変更

Astroのビルド前（`astro build` の前）に、必ずこのスクリプトが走るように `package.json` の `scripts` を調整します。`prebuild` を定義すると、`npm run build` 時に自動で実行されます。

```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "prebuild": "node gen-licenses.js",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}

```

*※ローカル開発環境（`npm run dev`）でも表示を確認したい場合は、一度手動で `node gen-licenses.js` を実行して `src/data/licenses.json` を作っておいてください。*

### 4. Astroで表示ページを作成

生成された `licenses.json` を読み込んで、ページ（例: `src/pages/licenses.astro`）を作成します。

```astro
---
// src/pages/licenses.astro
import Layout from '../layouts/Layout.astro';
import licensesData from '../data/licenses.json';

// オブジェクト形式から配列形式に変換して扱いやすくする
const licenses = Object.entries(licensesData).map(([name, info]) => {
  return {
    name,
    ...info,
  };
});
---

<Layout title="OSS Licenses">
  <main class="license-container">
    <h1>オープンソースソフトウェアのライセンス</h1>
    <p>当ウェブサイトでは、以下のオープンソースソフトウェアを使用しています。</p>

    <div class="license-list">
      {licenses.map((pkg) => (
        <section class="license-card">
          <h2>{pkg.name}</h2>
          <p><strong>ライセンス:</strong> {pkg.licenses}</p>
          {pkg.repository && (
            <p><strong>リポジトリ:</strong> <a href={pkg.repository} target="_blank" rel="noopener noreferrer">{pkg.repository}</a></p>
          )}
          {pkg.licenseText && (
            <details>
              <summary>ライセンス全文を表示</summary>
              <pre>{pkg.licenseText}</pre>
            </details>
          )}
        </section>
      ))}
    </div>
  </main>
</Layout>

<style>
  .license-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  .license-list {
    margin-top: 2rem;
  }
  .license-card {
    border-bottom: 1px solid #eee;
    padding: 1.5rem 0;
  }
  .license-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }
  details {
    margin-top: 0.5rem;
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
  }
  pre {
    white-space: pre-wrap;
    font-size: 0.85rem;
    max-height: 200px;
    overflow-y: auto;
  }
</style>

```

---

## 💡 知っておくと便利なTips

* **`production: true` の設定について**
`gen-licenses.js` のオプションで `production: true` を指定しています。これにより、ユーザーのブラウザに配信されるコード（`dependencies`）のライセンスだけが抽出され、開発時にしか使わないツール（`devDependencies`）が除外されるため、ページがスッキリします。
* **ライセンス全文の折りたたみ**
MITライセンスなどは全文表記が必要なケースが多いため、上記コードでは `<details>` タグを使って、必要な人だけがアコーディオンを開いて読めるようにしています。デザイン的にも邪魔になりません。
