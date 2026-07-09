// sidey.config.ts

export const sideyConfig = {
  /**
   * Global SEO and Site Identity
   * -------------------------------------------------------------------------
   * These values populate your HTML meta tags, RSS feed definitions,
   * and structural header components across the template.
   */
  site: {
    // ブラウザタブや検索結果に表示されるタイトル
    title: "気象庁 短期予報解説資料 / 関連天気図・衛星画像 | katonobu",

    // SEO・SNSカードに使われる短い説明文
    description: "気象庁が一日2回発表している短期予報解説資料と、その時刻に対応する関連天気図・衛星画像データを発表毎にまとめたページ。",

    // 公開する本番URL（GitHub Pages / CloudFront / Vercel など）
    url: "https://weatherchart.office-katonobu.com",

    // 著者名（著作権表記やmetaタグに使用）
    author: "katonobu",

    // HTML の lang 属性（日本語サイトなら "ja"）
    locale: "ja",
  },

  /**
   * Primary Sidebar Navigation
   * -------------------------------------------------------------------------
   * Controls the links rendered inside your fixed navigation panel.
   * You can add, reorder, or remove objects here to update your site's structure.
   */
  navigation: [
    { label: "Home", href: "/" },
    { label: "Recent", href: "/recent" },
    { label: "Archive", href: "/archive" },
    { label: "About", href: "/about" },
  ],
}

export type SideyConfigType = typeof sideyConfig
