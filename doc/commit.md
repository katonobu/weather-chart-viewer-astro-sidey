## 🎯 最重要ポイント
- **コミットメッセージに Issue 番号を入れる**  
 例：`fix: ログイン処理のバグ修正 (#123)`
- **Pull Request の説明欄に Issue 番号をリンクする**  
 例：`Closes #123`
- **変更理由・変更内容・テスト方法を PR に書く**
- **1 Issue = 1 ブランチ = 1 PR** が基本

---

## 🧱 コミットメッセージの書き方（Issue 対応時）
実践ガイドの推奨フォーマットに沿って、Issue 対応時の具体例を示します。  
  [株式会社みんなシステムズ](https://minna-systems.co.jp/blogs/3077/)

### コミットメッセージの構造
```
<type>: <subject> (#Issue番号)

<body>
<footer>
```

### type（変更種別）
- **feat**: 新機能  
- **fix**: バグ修正  
- **refactor**: リファクタリング  
- **docs**: ドキュメント  
- **test**: テスト  
- **chore**: ビルド/設定変更  

### 例：Issue #45 のバグ修正
```
fix: ログイン後のリダイレクト不具合を修正 (#45)

- セッション情報が正しく保持されない問題を修正
- テストケースを追加
```

### 例：Issue #78 の機能追加
```
feat: プロフィール画像アップロード機能を追加 (#78)

- S3 へのアップロード処理を追加
- バリデーションを追加
```

---

## 🌿 ブランチの作り方（Issue 対応時）
GitHub の一般的な運用として：

```
issue-<番号>-<簡単な説明>
```

例：
```
issue-45-fix-redirect
issue-78-add-avatar-upload
```

---

## 🚀 Pull Request の作り方（Issue 対応時）
GitHub Docs にある PR 作成手順を踏まえつつ、実務で必要な内容を整理します。  
  [GitHub Docs](https://docs.github.com/ja/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/creating-an-issue-or-pull-request-from-github-desktop?apiVersion=2022-11-28)

### PR タイトル
```
[FIX] ログイン後のリダイレクト不具合修正 (#45)
```

### PR 説明欄（テンプレート例）
```
## 変更の目的
Issue #45 のバグ修正のため。

## 変更内容
- セッション保持処理の修正
- リダイレクトロジックの調整
- テストケース追加

## テスト方法
- ログイン → マイページ遷移を確認
- セッション切れ時の挙動確認

## 関連 Issue
Closes #45
```
  [株式会社みんなシステムズ](https://minna-systems.co.jp/blogs/3077/)

### 「Closes #番号」を書く理由
PR がマージされると **Issue が自動で Close される**ため、管理が非常に楽になります。

---

## 📌 まとめ（実務で使う最短ルール）
- **コミットに Issue 番号を書く**  
- **PR に Issue 番号を書く（Closes #番号）**  
- **PR 説明欄に目的・変更内容・テスト方法を書く**  
- **1 Issue = 1 ブランチ = 1 PR**

