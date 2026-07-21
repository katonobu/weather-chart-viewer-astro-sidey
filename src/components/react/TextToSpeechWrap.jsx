import { TextToSpeechCtrl } from "@/components/react/TextToSpeechCtrl";
import { useFetchKaisetsuData } from "@/hooks/useFetchKaisetsuData";

export default function TextToSpeechWrap() {
    const {
        kaisetsu: kaisetsuTexts,
        loading: kaisetsuLoading
    } = useFetchKaisetsuData()

    return (
        <TextToSpeechCtrl texts={kaisetsuTexts} viewtext={true} loading={kaisetsuLoading} />
    )
}