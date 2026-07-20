import { usePhotoSwipe } from '../../hooks/usePhotoSwipe'
import 'photoswipe/style.css';
type Props = {
  id: string;
  children: React.ReactNode;
};

export const Photoswipe = ({ id, children }: Props) => {
  usePhotoSwipe(id, '.pswp-link');

  return (
    <>
      <style>{`
        /* 1. モーダル全体の背景（黒・透過）を確実に対象にする */
        .pswp,
        .pswp__bg { 
          background-color: rgba(0, 0, 0, 0.8) !important;
          --pswp-bg: rgba(0, 0, 0, 0.8) !important; 
        }

        /* 2. 画像が存在するステージエリアやズーム領域は「白」にする */
        .pswp__scroll-wrap,
        .pswp__item,
        .pswp__zoom-wrap,
        .pswp__img {
          background-color: #ffffff !important;
        }

        /* 3. 画像のアスペクト比・枠内収め（PNG/SVG対策） */
        .pswp__img {
          object-fit: contain !important;
        }

        /* 4. サムネイル・リンクのカーソル */
        .pswp-gallery a.pswp-link {  
          cursor: zoom-in;
          display: block;
        }
      `}</style>
      <div id={id} className="pswp-gallery">
        {children}
      </div>
    </>
  );
};