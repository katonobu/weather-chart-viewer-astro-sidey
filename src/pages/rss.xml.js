import rss from "@astrojs/rss"
import { config } from "@parseConfig"
import {
  getBuildDirList,
} from "@utils/s3";

export async function GET(context) {
  const dirList = (await getBuildDirList()) || []

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: context.site,
    items: dirList.map((dir)=>{
      const formattedTitle = `${dir.slice(0,4)}年${dir.slice(4,6)}月${dir.slice(6,8)}日 ${dir.slice(9,11)}時${dir.slice(11,13)}分 発表データ`
      const pubDate = new Date(`${dir.slice(0,4)}-${dir.slice(4,6)}-${dir.slice(6,8)}T${dir.slice(9,11)}:${dir.slice(11,13)}:00+09:00`)
      return {
        title: formattedTitle,
        description: `${formattedTitle}の短期予報解説資料および関連天気図・衛星画像の一覧です。`,
        link: `/view/${dir}/`,
        pubDate: pubDate,
        guid: `/view/${dir}/`
      };      
    }),
    customData: `<language>${config.site.locale}</language>`,
  })
}
