import rss from "@astrojs/rss"

import { config } from "@parseConfig"

export async function GET(context) {

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: context.site,
    items: [],
    customData: `<language>${config.site.locale}</language>`,
  })
}
