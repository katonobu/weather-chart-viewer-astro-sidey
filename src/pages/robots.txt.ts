import type { APIRoute } from 'astro';
import {SERVICE_URL} from '@utils/s3';
import { isProductionEnv } from '@utils/envUtil'

export const GET: APIRoute = () => {

  // 環境に応じたrobots.txtの中身を動的に生成
  const content = isProductionEnv
    ? `User-agent: *
Allow: /
Sitemap: ${SERVICE_URL}/sitemap-index.xml
`
    : `User-agent: *
Disallow: /
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};