import { useState, useEffect } from "react";
import {getContentsLinkUrl} from "../utils/s3"

export const useFetchDirList = () => {
  const [directories, setDirectories] = useState([])
  const [loading, setLoading] = useState(true)
  const contentsPath = getContentsLinkUrl()

  useEffect(() => {
    // public/directory_list.json を取得
    fetch(`${contentsPath}/directory_list.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch directory list')
        }
        return response.json()
      })
      .then(data => {
        setDirectories(data || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching directory list:', error)
        setLoading(false)
      })
  }, [contentsPath])

  return {
    directories,
    loading
  }
}
