import { useFetchMetaDataDetail } from "../../hooks/useFetchMetaDataDetail"
import { TextToSpeechCtrl } from "@/components/TextToSpeechCtrl";
import { useFetchDirList } from '../../hooks/useFetchDirList'
import { useFetchKaisetsuData } from "@/hooks/useFetchKaisetsuData";
import { Photoswipe } from "./Photoswipe";
import { getContentsLinkUrl } from "@/utils/s3"

export default function ArchiveView() {
    const {
        metadata: data,
        loading: detailLoading
    } = useFetchMetaDataDetail()

    const {
        directories: dirList,
        loading: dirLoading
    } = useFetchDirList()

    const {
        kaisetsu: kaisetsuTexts,
        loading: kaisetsuLoading
    } = useFetchKaisetsuData(data)

    const CONTENTS_LINK_URL = getContentsLinkUrl()

    if (dirLoading || detailLoading || !data) {
        return <p className="p-4">読み込み中...</p>
    }

    const currentIndex = dirList.indexOf(data.id)
    const newerId = 0 < currentIndex ? dirList[currentIndex - 1] : null
    const olderId = currentIndex < dirList.length - 1 ? dirList[currentIndex + 1] : null

    /* 
    ToDo:
    - Photoswipeのreact版移植/導入
    - クエリ文字列、アンカー併用時のURLの組み方確認
    - TTSコンポーネント暫定。
    - 画像のバックグラウンドカラー白にする
    - スタイルが微妙に違う。。
    - detailページまだ。
    */

    return (
        <div>
            <div>
                <h1 id="top">{data.title}</h1>
                <p>{data.released_at_j}</p>
            </div>
            <a href={`/archives?dir=${newerId}`}>
                {newerId ? "＜＜" : ""}
            </a>
            <span> 前後のデータ </span>
            <a href={`/archives?dir=${olderId}`}>
                {olderId ? "＞＞" : ""}
            </a>
            <h2>ページ内リンク</h2>
            <div>
                <ul>
                    {
                        data.files.map((file) => (
                            <li key={file.id}>
                                <a href={`#${file.id}`}>
                                    {file.title}
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <Photoswipe id="my-gallery" key={data.id}>
                <div>
                    {
                        data.files.map((file) => (
                            <section key={`${data.id}_${file.id}`} id={file.id}>
                                <a href={`${CONTENTS_LINK_URL}/${data.id}/${file.name}`} className="flex items-center gap-[6px] no-underline">
                                    <h2 className="mt-[40px] mb-[20px] leading-[1.3]">{file.title}</h2>
                                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="block mt-[40px] mb-[20px]">
                                        <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z" />
                                    </svg>
                                </a>

                                <div class="w-full overflow-x-auto bg-white border border-gray-100">
                                    <a href={`${CONTENTS_LINK_URL}/${data.id}/${file.name}`}
                                        className="pswp-link"
                                        data-pswp-src={`${CONTENTS_LINK_URL}/${data.id}/${file.name}`}
                                        data-pswp-width={file.width}
                                        data-pswp-height={file.height}
                                    >
                                        <img
                                            src={`${CONTENTS_LINK_URL}/${data.id}/${file.name}`}
                                            alt={file.title}
                                            style={{ aspectRatio: `${file.width} / ${file.height}` }}
                                            className="block w-full"
                                            loading="lazy"
                                        />
                                    </a>
                                </div>

                                <a href="#top">ページの先頭へ</a>
                            </section>
                        ))
                    }
                </div>
            </Photoswipe>
            <h2>データ情報</h2>
            <a href="https://www.jma.go.jp/jma/index.html">
                気象庁ホームページ
            </a>のデータを加工して作成。
            <br />
            本サイトで引用している気象庁データの引用元URL及び加工方法詳細は
            <a href="/datafetch"> 出典情報 </a>参照。
            <br />
            本ページで参照した加工元データ詳細は
            <a href={`/archive-details/${data.id}`}> データ詳細情報 </a>参照。

            <div
                slot="player"
                className="fixed inset-x-0 bottom-0 z-[100] bg-white border-t border-gray-200 p-4 shadow-lg"
            >
                <TextToSpeechCtrl texts={kaisetsuTexts} viewtext={true} loading={kaisetsuLoading} />
            </div>
        </div>
    )
}
