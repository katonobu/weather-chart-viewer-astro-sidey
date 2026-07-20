import { useState, useEffect } from "react";
import {getContentsLinkUrl} from "../utils/s3"

export const isTankiYohou = (metadata) => (metadata && metadata.title === "短期予報解説資料")

export const useFetchKaisetsuData = ( metadata ) => {
  const [kaisetsu, setKaisetsu] = useState([])
  const [loading, setLoading] = useState(true)
  // 環境変数 VITE_CONTENTS_PATH を参照
  const contentsPath = getContentsLinkUrl()

  useEffect(() => {
    if (isTankiYohou(metadata)) {
      fetch(`${contentsPath}/${metadata.id}/kaisetsu_tanki.json`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch kaisetsu data')
          return response.json()
        })
        .then(data => {
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
        })
        .catch(error => {
          console.error('Error fetching kaisetsu data:', error)
        })
    }
  }, [metadata, contentsPath])

  return {
    kaisetsu,
    loading
  }
}
