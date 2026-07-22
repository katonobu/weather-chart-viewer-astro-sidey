export const envTarget = (import.meta.env.VITE_ENV || 'dev')

const envTargetUpper = envTarget.toUpperCase()

// ステージ名の変換ロジック
const envTargetMap: Record<string, string> = {
  PRD: " ",
  STG: "（ステージング環境）",
  DEV: "（開発環境）"
};

export const envTargetStr = envTargetMap[envTargetUpper] || `（不明環境:${envTarget}）`;
export const isProductionEnv = (envTargetUpper === "PRD")

