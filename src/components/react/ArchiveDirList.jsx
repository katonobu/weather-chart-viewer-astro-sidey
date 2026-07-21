import { useFetchDirList } from '@hooks/useFetchDirList'

export default function ArchiveDirList() {
  const {
    directories,
    loading
  } = useFetchDirList()

  if (loading) return <p className="p-4">読み込み中...</p>

  return (
    <div>
        <ul id="weather-list" className="list-none p-0">
        {
            directories.slice(14).map((id) => {
                return (
                    <li key={id} className="mb-4 p-4 border border-gray-300 rounded-lg">
                        <a href={`/archives?dir=${id}`} className="no-underline text-inherit">
                            <h3>{id.slice(0,4)}年{id.slice(4,6)}月{id.slice(6,8)}日 {id.slice(9,11)}時{id.slice(11,13)}分 発表</h3>
                        </a>
                    </li>
                )
            })
        }
        </ul>
    </div>
  )
}
