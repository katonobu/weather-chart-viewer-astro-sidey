import { useState, useEffect, useRef } from "react";

export function useTtsTicker(
  currentStr,
  playingStt,
  eventInfo,
  startOffset,
  updateIntervalMs = 500
) {
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [charsPerSec, setCharsPerSec] = useState(4.2); // 初期値は仮
  const [eventFired, setEventFired] = useState(false)
  const elapsedRef = useRef(0);
  const timerRef = useRef(null);

  // currentStrが変わったらリセット
  useEffect(() => {
    setDisplayStartIndex(0);
    setEventFired(false)
    elapsedRef.current = 0;
  }, [currentStr]);

  // boundaryイベントで更新
  useEffect(() => {
    if (eventInfo) {
//    if (false) {
      if (!eventFired) {
        setEventFired(true)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setDisplayStartIndex(Math.max(0, eventInfo.charIndex - startOffset));
      if (eventInfo.elapsedTime > 0) {
        setCharsPerSec(eventInfo.charIndex / (eventInfo.elapsedTime / 1000));
      }
    }
  }, [eventInfo]);

  // 再生状態に応じてタイマー制御
  useEffect(() => {
    if (playingStt === "PLAY" && !eventFired) {
      timerRef.current = setInterval(() => {
        elapsedRef.current += updateIntervalMs;
        const nextIndex = Math.floor((charsPerSec * elapsedRef.current) / 1000);
        setDisplayStartIndex(Math.max(0, nextIndex - startOffset))
//        console.log("Timer updated")
      }, updateIntervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playingStt, charsPerSec, eventFired]);

  return { displayStartIndex, charsPerSec };
}