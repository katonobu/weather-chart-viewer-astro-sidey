// src/utils/s3.ts

/*
単語定義
- コンテンツ
  - 天気図等の取得した画像データ
- コンテンツディレクトリ
  - コンテンツの保存されているディレクトリ
- コンテンツページ
  - コンテンツディレクトリ以下のファイルと1対1で対応したhtml
- トップページ
  - コンテンツページへの一覧を含むページ

  対応すべき環境
- ローカル開発
  - コンテンツパスはFQDN指定
  - ページ内は相対パス指定
- リリース
  - コンテンツパスは相対パス指定
  - ページ内は相対パス指定
if (isGitHubActions) {
  console.log("GitHub Actions 上で動作しています");
} else {
  console.log("ローカル環境で動作しています");
}


- コンテンツディレクトリ更新
  - astro-sideyはコンテンツディレクトリはいじらない
- ページ更新
  - トップページ、コンテンツページとも更新する。
  - コンテンツ取得と同じタイミングで実行する場合
    - コンテンツページは、直近2ページ分を生成
*/


// S3のバケットURL（環境に合わせて変更してください）
const S3_DOMAIN = "d1xdqsn7je8bay.cloudfront.net"
const S3_PREFIX = "shared/services/weatherchart"
const CONTENTS_FETCH_URL = `https://${S3_DOMAIN}/${S3_PREFIX}`;

let dirlistCache:string[]|null = null

/**
 * IDリストを取得 (一覧表示用)
 */
export async function getDirectoryList(): Promise<string[]|null> {
  if (dirlistCache === null) {
    const response = await fetch(`${CONTENTS_FETCH_URL}/directory_list.json`);
    if (!response.ok) throw new Error("Failed to fetch directory list");
    dirlistCache = await response.json();
  }
  return dirlistCache;
}

/**
 * 特定IDの詳細メタデータを取得 (詳細ページ用)
 */
export async function getDetailData(id: string) {
  const response = await fetch(`${CONTENTS_FETCH_URL}/${id}/metadata_detail.json`);
  if (!response.ok) throw new Error(`Failed to fetch metadata for ${id}`);
  return await response.json();
}

export async function getStaticPathsByTargetId(targetId:string) {
  if (targetId === "ALL") { // "ALL"が指定されたら全部
    const list = (await getDirectoryList()) || []; // ['20260703_1540', '20260703_0000', ...]
    return list.map((id: string) => ({ params: { id } }));
  } else if (targetId) { // ALL以外、何か指定されていたらディレクトリ名とみなす。
    return [{ params: { id: targetId } }];
  } else { // なにも指定されていなければ、最新の2つ分を生成対象とする。
    const list = (await getDirectoryList()) || []; // ['20260703_1540', '20260703_0000', ...]
    return list.slice(0,2).map((id: string) => ({ params: { id } }));
  }
}

// 各コンテンツページでの画像リンクURL生成用URLを返す
// 差分吸収はastro.config.mjsのserver.proxyで実施する。
export function getContentsLinkUrl() {
  return `/${S3_PREFIX}`
}

type KaisetsuItem = {
  name: string,
  sentences: string[]
}

export async function getKaisetsu(id: string): Promise<string[]> {
  const response = await fetch(`${CONTENTS_FETCH_URL}/${id}/kaisetsu_tanki.json`);
  if (!response.ok) throw new Error(`Failed to fetch metadata for ${id}`);
  const data = await response.json()

  const tracks = []
  tracks.push([
    data[0].name,
    data[0].sentences[0]
  ].join("\n"))
  tracks.push(data[1].name)
  data[1].subsections.forEach((item:KaisetsuItem) => {
    const texts = []
    texts.push(item.name)
    item.sentences.forEach((sentence:string) => texts.push(sentence))
    tracks.push(texts.join("\n"))
  })
  tracks.push(data[2].name)
  data[2].subsections.forEach((item:KaisetsuItem) => {
    const texts =[]
    texts.push(item.name)
    item.sentences.forEach((sentence:string) => texts.push(sentence))
    tracks.push(texts.join("\n"))
  })

  return tracks
}

interface Dimensions {
  width: number;
  height: number;
}

const fileWidthHeight: Record<string, Dimensions> = {
  'kaisetsu_tanki.svg': { width: 595, height: 842 },
  'ASAS.svg': { width: 1928, height: 1363 },
  'rain_YYYYMMDDHHMMSS_f00_a00_combined.png': { width: 940, height: 783 },
  'YYYYMMDDHHMMSS_vis.png': { width: 1536, height: 1024 },
  'YYYYMMDDHHMMSS_ir.png': { width: 1536, height: 1024 },
  'YYYYMMDDHHMMSS_vap.png': { width: 1536, height: 1024 },
  'YYYYMMDDHHMMSS_color.png': { width: 1536, height: 1024 },
  'YYYYMMDDHHMMSS_strengthen.png': { width: 1536, height: 1024 },
  'AUPQ35.svg': { width: 725.67, height: 1060.23 },
  'AUPQ78.svg': { width: 725.67, height: 1060.23 },
  'AXFE578.svg': { width: 479.31, height: 725.67 },
  'AXJP130_AXJP140.svg': { width: 725.67, height: 988.08 },
  'FSAS24.svg': { width: 1191, height: 842 },
  'FSAS48.svg': { width: 1191, height: 842 },
  'FXFE502.svg': { width: 915.55, height: 725.67 },
  'FXFE504.svg': { width: 915.55, height: 725.67 },
  'FXFE5782.svg': { width: 915.55, height: 725.67 },
  'FXFE5784.svg': { width: 915.55, height: 725.67 },
  'FXJP854.svg': { width: 725.67, height: 833.46 }
}

const tailMatchMap: Record<string, string> = {
  '_f00_a00_combined.png': 'rain_YYYYMMDDHHMMSS_f00_a00_combined.png',
  '_vis.png': 'YYYYMMDDHHMMSS_vis.png',
  '_ir.png': 'YYYYMMDDHHMMSS_ir.png',
  '_vap.png': 'YYYYMMDDHHMMSS_vap.png',
  '_color.png': 'YYYYMMDDHHMMSS_color.png',
  '_strengthen.png': 'YYYYMMDDHHMMSS_strengthen.png',
};

export async function getDetailDataWithPxSize(id: string) {
  const detail = await getDetailData(id);

  for (const file of detail.files) {
    const fileName = file.name as string;

    // 直接ヒットする場合
    if (fileWidthHeight[fileName]) {
      file.width = fileWidthHeight[fileName].width;
      file.height = fileWidthHeight[fileName].height;
      continue;
    }

    // 接尾辞によるマッチングを探す
    const suffix = Object.keys(tailMatchMap).find((s) => fileName.endsWith(s));
    
    if (suffix) {
      const templateKey = tailMatchMap[suffix];
      const dimension = fileWidthHeight[templateKey];
      
      if (dimension) {
        file.width = dimension.width;
        file.height = dimension.height;
      }
    }
  }
  return detail;
}
