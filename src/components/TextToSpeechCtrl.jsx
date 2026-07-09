import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { useTtsTicker } from "../hooks/useTtsTicker";
import { TtsTicker } from "./TtsTicker";

export const TextToSpeechCtrl = ({texts, viewtext = true, loading = false}) => {
  const {
    playingStt,
    currentTrack,
    totalTracks,
    currentStr,
    eventInfo,
    playStopDisabled,
    playStop,
    prevTrackDisabled,
    prevTrack,
    nextTrackDisabled,
    nextTrack,
  } = useTextToSpeech(texts);

  const playStopButtonLabel =
    (playingStt === "IDLE" || playingStt === "PAUSE") ? "▶" :  (playingStt === "PLAY") ? "⏹" : "..."

  const startOffset = 3
  const updateIntervalMs = 500
  const {displayStartIndex} = useTtsTicker(currentStr, playingStt, eventInfo, startOffset, updateIntervalMs)
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="flex items-center justify-start space-x-4">
        <button
          className={`px-1 py-1 rounded text-white 
                      ${prevTrackDisabled() || loading || !texts ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={prevTrack}
          disabled={prevTrackDisabled() || loading || !texts}
        >⏮</button>
        <button
          className={`px-1 py-1 rounded text-white 
                      ${playStopDisabled() || loading || !texts ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={playStop}
          disabled={playStopDisabled() || loading || !texts}
        >{playStopButtonLabel}</button>
        <button
          className={`px-1 py-1 rounded text-white 
                      ${nextTrackDisabled() || loading || !texts ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          onClick={nextTrack}
          disabled={nextTrackDisabled() || loading || !texts}
        >⏭</button>
        <p>{loading?"Loading ...":`TRACK : ${currentTrack + 1}/${totalTracks}`}</p>
      </div>
      <div>
        {viewtext?<TtsTicker currentStr={currentStr} displayStartIndex={displayStartIndex}></TtsTicker>:null}
      </div>
    </div>
  );
};
