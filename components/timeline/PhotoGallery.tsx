'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { MicroCMSImage } from '../../types';

type Props = {
  photos: MicroCMSImage[];
};

/**
 * サムネイル一覧。クリックすると`<dialog>`で拡大表示し、複数枚のときは前後へ切り替えられる
 * (Escで閉じる/←→で切り替え/背景クリックで閉じる)。
 */
export default function PhotoGallery({ photos }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);

  const open = (index: number) => {
    setCurrent(index);
    dialogRef.current?.showModal();
  };
  const move = (delta: number) => setCurrent((index) => (index + delta + photos.length) % photos.length);

  const photo = photos[current];
  const hasMany = photos.length > 1;
  const buttonClass =
    'absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-2xl leading-none text-white hover:bg-black/70';

  return (
    <>
      {photos.map((item, index) => (
        <button
          key={`${item.url}-${index}`}
          type="button"
          onClick={() => open(index)}
          aria-label={`写真${index + 1}を拡大表示`}
          className="cursor-zoom-in"
        >
          <Image src={item.url} alt="" width={200} height={150} className="h-auto rounded-sm" />
        </button>
      ))}
      <dialog
        ref={dialogRef}
        aria-label="写真の拡大表示"
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/80"
        onClick={(event) => {
          // 画像・ボタン以外(背景)のクリックで閉じる
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onKeyDown={(event) => {
          if (!hasMany) return;
          if (event.key === 'ArrowLeft') move(-1);
          if (event.key === 'ArrowRight') move(1);
        }}
      >
        <div className="relative flex items-center justify-center p-2">
          <Image
            src={photo.url}
            alt=""
            width={photo.width ?? 1200}
            height={photo.height ?? 900}
            sizes="90vw"
            className="h-auto max-h-[85vh] w-auto max-w-[90vw] rounded-sm object-contain"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="閉じる"
            className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-lg leading-none text-white hover:bg-black/70"
          >
            ×
          </button>
          {hasMany && (
            <>
              <button type="button" onClick={() => move(-1)} aria-label="前の写真" className={`${buttonClass} left-3`}>
                ‹
              </button>
              <button type="button" onClick={() => move(1)} aria-label="次の写真" className={`${buttonClass} right-3`}>
                ›
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-0.5 text-sm text-white">
                {current + 1} / {photos.length}
              </span>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
