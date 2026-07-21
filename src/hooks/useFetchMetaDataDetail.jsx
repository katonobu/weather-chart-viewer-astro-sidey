import { useState, useEffect } from "react";
import {getContentsLinkUrl} from "@utils/s3"

export const useFetchMetaDataDetail = ( ) => {
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const contentsPath = getContentsLinkUrl()
    const params = new URLSearchParams(window.location.search);
    const dir = params.get("dir");

    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${contentsPath}/${dir}/metadata_detail.json`);

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

        setMetadata(data);
        setLoading(false);

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
      fetchMetadata();
    }
  }, [])

  return {
    metadata,
    loading,
    error,
  }
}
