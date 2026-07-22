import React from "react";

export function TtsTicker({ currentStr, displayStartIndex }) {
  // 1文字あたりの幅(px)を仮定（フォントサイズに応じて調整）
  const charWidthPx = 16;

  // 表示文字列全体を保持
  const displayStr = currentStr;

  // スクロール位置を計算
  const translateX = -(displayStartIndex * charWidthPx);

  return (
    // 1. 外側の枠コンテナ
    <div className="hidden md:block w-full border border-stone-300 bg-stone-50 rounded-lg p-2 overflow-hidden mt-2">
    
      {/* 2. マスク（オプション：端をフェードアウトさせたい場合） */}
      <div className="w-full overflow-hidden whitespace-nowrap text-lg font-mono [mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]">
        
        <div
          className="
            inline-block
            transition-transform
            duration-500
            ease-linear
          "
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {displayStr}
        </div>
      </div>
    </div>
  );
}
