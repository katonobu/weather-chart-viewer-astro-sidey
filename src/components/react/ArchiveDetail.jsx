import { useFetchMetaDataDetail } from "@hooks/useFetchMetaDataDetail"
import { navigate } from 'astro:transitions/client';

export default function ArchiveDetail() {
    const {
        metadata: data,
        loading: detailLoading,
        error
    } = useFetchMetaDataDetail()

    if (detailLoading) {
        return <p className="p-4">読み込み中...</p>
    }

    if (error) {
        console.error(error)
        navigate('/error');
        return <p className="p-4">エラー...</p>
    }

    if (!data) {
        console.error("No error but data is invalid")
        navigate('/error');
        return <p className="p-4">エラー...</p>
    }


    return (
        <div>
            <h1>{data.title} の加工元データ詳細</h1>
            <p><strong>発表日時:</strong> {data.released_at_j}</p>

            <div>
                {data.files.map((file) => (
                    <div key={`${data.id}_${file.id}`}>
                        <section className="m-4 p-4 border border-gray-100 rounded-lg">
                            <h2 className="text-lg border-b border-gray-200 pb-2 mt-3">{file.title}</h2>
                            <ul className="list-none pl-0">
                            <li className="mb-2"><strong>ダウンロード時刻(UTC):</strong> {file.download_at}</li>
                            <li className="mb-2">
                                <strong>ダウンロード元URL:</strong>
                                <ul  className="list-none pl-0">
                                {file.urls.map((url, idx) => (
                                    <li 
                                      className="mb-2"
                                      key={`${data.id}_${file.id}_${idx}`}
                                    >
                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                            {url}
                                        </a>
                                    </li>
                                ))}
                                </ul>
                            </li>
                            <li className="mb-2"><strong>ファイル形式:</strong> {file.output}</li>
                            <li className="mb-2"><strong>ファイルサイズ:</strong> {(file.size / 1024).toFixed(2)} KB</li>
                            </ul>
                        </section>
                        <a href={`/archives?dir=${data.id}`}>← 天気図ページに戻る</a>
                    </div>
                ))}
            </div>
        </div>
    )
}
