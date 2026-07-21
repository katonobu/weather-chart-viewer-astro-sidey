import { useState, useEffect } from "react";
import {getContentsLinkUrl} from "@utils/s3"

export const useFetchMetaDataDetail = ( ) => {
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const contentsPath = getContentsLinkUrl()
    const params = new URLSearchParams(window.location.search);
    const dir = params.get("dir");

    fetch(`${contentsPath}/${dir}/metadata_detail.json`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch metadata')
        return response.json()
      })
      .then(data => {
        setMetadata(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching metadata:', error)
        setLoading(false)
      })
  }, [])

  return {
    metadata,
    loading
  }
}
