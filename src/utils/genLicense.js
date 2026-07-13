// gen-licenses.js
import * as checker from 'license-checker-rseidelsohn'; // 👈 ここを変更
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