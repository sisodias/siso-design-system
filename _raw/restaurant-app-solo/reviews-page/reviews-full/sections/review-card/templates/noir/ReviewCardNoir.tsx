"use client";

import Image from 'next/image';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { VerifiedIcon, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewCardComponentProps } from '../../types';

export default function ReviewCardNoir({ review, onImageClick, onHelpfulClick }: ReviewCardComponentProps) {
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
        'relative isolate w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br',
        'from-zinc-950 via-zinc-900 to-black p-1.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]',
        'transition-all duration-300 hover:shadow-[0_28px_70px_-28px_rgba(0,0,0,0.95)]',
        featured && 'ring-2 ring-yellow-500/40'
      )}
    >
      <div
        className={cn(
          'relative w-full rounded-xl border border-zinc-700/60 bg-zinc-900/70 p-5 text-zinc-200',
          'shadow-[0_18px_48px_-30px_rgba(0,0,0,0.85)] backdrop-blur-sm'
        )}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
              <span className="text-lg font-bold text-white">{authorName.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-white">{authorName}</span>
                  {verified && <VerifiedIcon className="h-4 w-4 text-sky-400" />}
                  {featured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.35)]" />}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-400">
                  <span>{source === 'website' ? 'Website Review' : source}</span>
                  <span className="text-zinc-600">·</span>
                  <span>{timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {stars.map((filled, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'h-4 w-4',
                      filled ? 'fill-yellow-400 text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.35)]' : 'fill-zinc-800 text-zinc-700'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-base leading-relaxed text-zinc-300">{comment}</p>
        </div>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => onImageClick?.(images, idx)}
                className="relative aspect-square overflow-hidden rounded-lg border border-zinc-700/70 transition-opacity hover:opacity-90"
              >
                <Image
                  src={img}
                  alt={`Review photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 150px"
                />
                {idx === 2 && images.length > 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm font-semibold text-white">
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
                className="rounded-full border border-zinc-700/70 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-300"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {ownerResponse && (
          <div className="mt-4 border-t border-zinc-700/70 pt-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
                  <span className="text-sm font-bold text-white">🏪</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white">Response from Owner</span>
                  <VerifiedIcon className="h-4 w-4 text-sky-400" />
                  {ownerRespondedAt && (
                    <>
                      <span className="text-xs text-zinc-600">·</span>
                      <span className="text-xs text-zinc-400">
                        {formatDistanceToNow(new Date(ownerRespondedAt), { addSuffix: true })}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-zinc-400">{ownerResponse}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-3">
          <button
            onClick={handleHelpfulClick}
            disabled={isHelpfulClicked}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              isHelpfulClicked ? 'text-primary-300' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>{isHelpfulClicked ? '👍' : '👍🏼'}</span>
            <span>Helpful ({helpfulCount + (isHelpfulClicked ? 1 : 0)})</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/reviews#${id}`);
            }}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-200"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
