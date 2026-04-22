
import { Button } from '@/domains/shared/components';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { MenuCategoriesAbout } from '../../types/schema';

type MenuAboutSectionProps = {
  about?: MenuCategoriesAbout;
};

const DEFAULT_PARAGRAPHS = [
  'Located at 108 Cricklewood Broadway, London NW2 3EJ, Elementree offers authentic Italian cuisine and 100% Neapolitan pizzas made by our Italian pizzaiolo from Naples, using traditional recipes passed down through generations.',
  'Our menu celebrates the perfect balance of the four elements: earth, water, fire, and air. We use locally sourced ingredients and offer a range of options for vegetarians, vegans, and those with gluten-free requirements.',
  'For any special dietary needs or inquiries, please contact us at +44 20 8830 9344 or ask your server for assistance.',
];

const MenuAboutSection = ({ about }: MenuAboutSectionProps) => {
  const heading = about?.heading ?? 'About Our Menu';
  const paragraphs = about?.paragraphs && about.paragraphs.length > 0 ? about.paragraphs : DEFAULT_PARAGRAPHS;
  const ctaLabel = about?.ctaLabel ?? 'Order Online Now';
  const ctaHref = about?.ctaHref ?? '/order';

  return (
    <div className="mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/70 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="space-y-5">
        <h3 className="text-2xl font-semibold text-white md:text-3xl">{heading}</h3>
        <div className="space-y-4 text-sm leading-relaxed text-white/75 md:text-base">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="pt-4">
          <Button
            asChild
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary/80 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-primary"
          >
            <Link href={ctaHref}>
              <ShoppingBag className="h-4 w-4" />
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuAboutSection;
