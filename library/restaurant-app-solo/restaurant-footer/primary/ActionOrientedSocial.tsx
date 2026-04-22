'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
}

interface ActionOrientedSocialProps {
  socialMedia?: SocialMediaLinks;
}

export function ActionOrientedSocial({ socialMedia }: ActionOrientedSocialProps) {
  // Don't render if no social media links provided
  if (!socialMedia || (!socialMedia.instagram && !socialMedia.facebook)) {
    return null;
  }

  // Extract Instagram handle from URL
  const getInstagramHandle = (url?: string) => {
    if (!url) return null;
    const match = url.match(/instagram\.com\/([^/?]+)/);
    return match ? `@${match[1]}` : null;
  };

  const instagramHandle = getInstagramHandle(socialMedia?.instagram);

  return (
    <div className="mb-5 w-full max-w-md">
      {/* Instagram - Bold Gradient Card */}
      {socialMedia.instagram && (
        <a
          href={socialMedia.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
              <Image
                src="/images/shared/icons/instagram.svg"
                alt="Instagram"
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{instagramHandle || 'Instagram'}</p>
              <p className="text-xs text-white/80 mt-0.5">See our daily specials</p>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
        </a>
      )}
    </div>
  );
}
