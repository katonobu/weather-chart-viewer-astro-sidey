import { useState, useEffect } from "react";
import {getContentsLinkUrl} from "@utils/s3"

export const useFetchKaisetsuData = ( ) => {
  const [kaisetsu, setKaisetsu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const contentsPath = getContentsLinkUrl()
    const params = new URLSearchParams(window.location.search);
    const dir = params.get("dir");

    const fetchKaisetsudata = async () => {
      try {
        const response = await fetch(`${contentsPath}/${dir}/kaisetsu_tanki.json`);

        if (!response.ok) {
          setError(`Invalid pespose: ${dir}`);
          setLoading(false);
          return
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          setError(`Invalid parameter: ${dir}`);
          setLoading(false);
          return
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          setError(`Invalid JSON: ${dir}`);
          setLoading(false);
          return
        }

        const tracks = []
        tracks.push([
          data[0].name,
          data[0].sentences[0]
        ].join("\n"))
        tracks.push(data[1].name)
        data[1].subsections.forEach(item => {
          const texts = []
          texts.push(item.name)
          item.sentences.forEach(sentence => texts.push(sentence))
          tracks.push(texts.join("\n"))
        })
        tracks.push(data[2].name)
        data[2].subsections.forEach(item => {
          const texts =[]
          texts.push(item.name)
          item.sentences.forEach(sentence => texts.push(sentence))
          tracks.push(texts.join("\n"))
        })
        setKaisetsu(tracks)
        setLoading(false)
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // nullチェック + 正規表現チェック
    if (!dir || !/^20\d{6}_(0340|1540)$/.test(dir)) {
      setLoading(false)
      setError(`Invalid parameter: ${dir}`);
    } else {
      fetchKaisetsudata()
    }
  }, [])

  return {
    kaisetsu,
    loading,
    error,
  }
}
