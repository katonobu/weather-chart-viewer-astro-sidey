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

