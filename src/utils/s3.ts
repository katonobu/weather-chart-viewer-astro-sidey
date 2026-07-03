// src/utils/s3.ts

const S3_BASE_URL = "https://d1xdqsn7je8bay.cloudfront.net/shared/services/weatherchart";

/**
 * IDリストを取得 (一覧表示用)
 */
export async function getDirectoryList(): Promise<string[]> {
  const response = await fetch(`${S3_BASE_URL}/directory_list.json`);
  if (!response.ok) throw new Error("Failed to fetch directory list");
  return await response.json();
}

/**
 * 特定IDの詳細メタデータを取得 (詳細ページ用)
 */
export async function getDetailData(id: string) {
  const response = await fetch(`${S3_BASE_URL}/${id}/metadata_detail.json`);
  if (!response.ok) throw new Error(`Failed to fetch metadata for ${id}`);
  return await response.json();
}