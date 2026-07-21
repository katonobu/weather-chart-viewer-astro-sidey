import probe from 'probe-image-size';
import { parse } from 'node-html-parser'; // npm install node-html-parser
import {
  getDirectoryList,
  getDetailData
} from "@util/s3.ts";

const S3_DOMAIN = "d1xdqsn7je8bay.cloudfront.net"
const S3_PREFIX = "shared/services/weatherchart"
const CONTENTS_FETCH_URL = `https://${S3_DOMAIN}/${S3_PREFIX}`;

const getImageSize = async (imageUrl) => {
  // SVG の場合
  if (imageUrl.endsWith('.svg')) {
    const response = await fetch(imageUrl);
    const svgText = await response.text();
    const root = parse(svgText);
    const svg = root.querySelector('svg');
    
    // viewBox から取得 (例: "0 0 800 600")
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(' ');
      return { width: parts[2], height: parts[3] };
    }
    // width/height 属性があればそれを使う
    return { width: svg.getAttribute('width'), height: svg.getAttribute('height') };
  }

  // PNG/JPEG の場合
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  const probeResult = probe.sync(buffer);
  return {width:probeResult.width, height:probeResult.height}
}

const getDetailDataWithPxSize = async (id) => {
  console.log(`getDetailDataWithPxSize(${id})`)
  const detail = await getDetailData(id)
  const resultObj = {}
  for (const file of detail.files) {
    console.log(file.name)
    const imageUrl = `${CONTENTS_FETCH_URL}/${id}/${file.name}`
    resultObj[file.name] = await getImageSize(imageUrl)
  }
  return resultObj
}


const main = async () => {
    const list = await getDirectoryList();
    const resultObj = await getDetailDataWithPxSize(list[0])
    console.log(resultObj)
}

await main()