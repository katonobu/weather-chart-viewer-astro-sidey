// src/utils/s3.ts

// S3のバケットURL（環境に合わせて変更してください）
const S3_DOMAIN = "d1xdqsn7je8bay.cloudfront.net"
export const SERVICE_BASE_URL = `https://${S3_DOMAIN}`;
export const CONTENTS_BASE_URL = `https://${S3_DOMAIN}/shared/services/weatherchart`;


let dirlistCache:string[]|null = null

/**
 * IDリストを取得 (一覧表示用)
 */
export async function getDirectoryList(): Promise<string[]|null> {
  if (dirlistCache === null) {
    const response = await fetch(`${CONTENTS_BASE_URL}/directory_list.json`);
    if (!response.ok) throw new Error("Failed to fetch directory list");
    dirlistCache = await response.json();
  }
  return dirlistCache;
}

/**
 * 特定IDの詳細メタデータを取得 (詳細ページ用)
 */
export async function getDetailData(id: string) {
  const response = await fetch(`${CONTENTS_BASE_URL}/${id}/metadata_detail.json`);
  if (!response.ok) throw new Error(`Failed to fetch metadata for ${id}`);
  return await response.json();
}

export async function getStaticPathsByTargetId(targetId:string) {
  if (targetId === "ALL") { // "ALL"が指定されたら全部
    const list = (await getDirectoryList()) || []; // ['20260703_1540', '20260703_0000', ...]
    return list.map((id: string) => ({ params: { id } }));
  } else if (targetId) {
    return [{ params: { id: targetId } }];
  } else {
    return [];
  }
}

type KaisetsuItem = {
  name: string,
  sentences: string[]
}

export async function getKaisetsu(id: string): Promise<string[]> {
  const response = await fetch(`${CONTENTS_BASE_URL}/${id}/kaisetsu_tanki.json`);
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
