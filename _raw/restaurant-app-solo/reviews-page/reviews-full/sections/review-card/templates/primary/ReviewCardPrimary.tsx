"use client";

import Image from 'next/image';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { VerifiedIcon, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewCardComponentProps } from '../../types';

export default function ReviewCardPrimary({ review, onImageClick, onHelpfulClick }: ReviewCardComponentProps) {
  const {
    id,
    authorName,
    rating,
    comment,
    publishedAt,
    source,
    verified,
    featured,
    images,
    ownerResponse,
    ownerRespondedAt,
    helpfulCount,
    metadata,
  } = review;

  const [isHelpfulClicked, setIsHelpfulClicked] = useState(false);

  const handleHelpfulClick = () => {
    if (!isHelpfulClicked && onHelpfulClick) {
      setIsHelpfulClicked(true);
      onHelpfulClick(id);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });
  const stars = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <div
      className={cn(
        'relative isolate w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br',
        'from-white via-white to-slate-50 p-1.5 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)]',
        'transition-all duration-300 hover:shadow-[0_24px_52px_-24px_rgba(15,23,42,0.45)]',
        'dark:border-zinc-800/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950',
        'dark:shadow-[0_18px_45px_-18px_rgba(0,0,0,0.65)] dark:hover:shadow-[0_24px_56px_-20px_rgba(0,0,0,0.75)]',
        featured && 'ring-2 ring-primary/30 dark:ring-primary/40'
      )}
    >
      <div
        className={cn(
          'relative w-full rounded-xl border border-slate-100/70 bg-white/95 p-5 text-slate-700',
          'shadow-[0_10px_30px_-22px_rgba(15,23,42,0.6)]',
          'dark:border-zinc-800/60 dark:bg-zinc-900/70 dark:text-zinc-100'
        )}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 dark:border-primary/30 dark:from-primary/25 dark:via-primary/15 dark:to-primary/35">
              <span className="text-lg font-bold text-primary-700 dark:text-primary-200">
                {authorName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-900 dark:text-zinc-100">{authorName}</span>
                  {verified && <VerifiedIcon className="h-4 w-4 text-primary dark:text-primary-300" />}
                  {featured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
                  <span>{source === 'website' ? 'Website Review' : source}</span>
                  <span className="text-slate-300 dark:text-zinc-600">·</span>
                  <span className="text-slate-500 dark:text-zinc-400">{timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {stars.map((filled, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'h-4 w-4',
                      filled
                        ? 'fill-yellow-400 text-yellow-500'
                        : 'fill-slate-200 text-slate-200 dark:fill-zinc-700/50 dark:text-zinc-700/50'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-slate-600 dark:text-zinc-200">{comment}</p>
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => onImageClick?.(images, idx)}
                className="relative aspect-square overflow-hidden rounded-lg border border-slate-200/80 hover:opacity-90 transition-opacity dark:border-zinc-700/60"
              >
                <Image
                  src={img}
                  alt={`Review photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 150px"
                />
                {idx === 2 && images.length > 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white">
                    +{images.length - 3}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {metadata?.highlights && metadata.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {metadata.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="rounded-full border border-slate-200/80 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-zinc-700/60 dark:bg-zinc-800/60 dark:text-zinc-300"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {ownerResponse && (
          <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-zinc-800/60">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 dark:border-primary/25 dark:from-primary/25 dark:via-primary/15 dark:to-primary/35">
                  <span className="text-sm font-bold text-primary-700 dark:text-primary-100">🏪</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    Response from Owner
                  </span>
                  <VerifiedIcon className="h-4 w-4 text-primary dark:text-primary-300" />
                  {ownerRespondedAt && (
                    <>
                      <span className="text-xs text-slate-300 dark:text-zinc-600">·</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">
                        {formatDistanceToNow(new Date(ownerRespondedAt), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-300">{ownerResponse}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-zinc-800/60">
          <button
            onClick={handleHelpfulClick}
            disabled={isHelpfulClicked}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isHelpfulClicked
                ? 'text-primary'
                : 'text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <span>{isHelpfulClicked ? '👍' : '👍🏼'}</span>
            <span>Helpful ({helpfulCount + (isHelpfulClicked ? 1 : 0)})</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/reviews#${id}`);
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
