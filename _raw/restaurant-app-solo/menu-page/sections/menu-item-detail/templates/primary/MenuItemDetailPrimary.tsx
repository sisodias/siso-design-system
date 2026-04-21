"use client";

import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimatedText, Badge } from '@/domains/shared/components';
import { Clock } from 'lucide-react';
import { getMenuItemImage } from '@/domains/customer-facing/menu/shared/utils/menu-images';
import type { MenuItem } from '@/domains/customer-facing/menu/shared/types';
import type { MenuItemDetailContent } from '../../types';

interface Props extends MenuItemDetailContent {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function MenuItemDetailPrimary({
  isOpen = false,
  onClose,
  heroImageUrl,
  gallery,
  id,
  name,
  description,
  price,
  currency,
  category,
  imageUrl,
  isVegetarian,
  isVegan,
  isGlutenFree,
  isSpicy,
  calories,
  protein,
  carbs,
  sugar,
  fat,
  prepTimeMin,
  spiceLevel,
  allergens,
  pairings,
  chefTip,
  origin,
  availability,
  winePairing,
  preparationNotes,
  isHalal,
  isKosher,
  servingSizeGrams,
  recommendedItems,
}: Props) {
  const fallbackItem: MenuItem = {
    id,
    name,
    description: description ?? null,
    price,
    category: category ?? '',
    image_url: imageUrl ?? null,
    is_vegetarian: isVegetarian ?? false,
    is_vegan: isVegan ?? false,
    is_gluten_free: isGlutenFree ?? false,
    is_spicy: isSpicy ?? false,
    ingredients: null,
    calories: calories ?? null,
    protein_g: protein ?? null,
    carbs_g: carbs ?? null,
    sugar_g: sugar ?? null,
    fat_g: fat ?? null,
    prep_time_min: prepTimeMin ?? null,
    allergens: allergens ?? null,
    is_halal: isHalal ?? null,
    is_kosher: isKosher ?? null,
    spice_level: spiceLevel ?? null,
    serving_size_g: servingSizeGrams ?? null,
    is_seasonal: null,
    is_new: null,
    created_at: null,
    pairings: pairings ?? null,
    chef_tip: chefTip ?? null,
    popular_score: 0,
  };

  const heroImage = heroImageUrl ?? getMenuItemImage(fallbackItem, 'hero');

  const priceLabel = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency ?? 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  const displayPairings = Array.isArray(pairings) ? pairings.filter(Boolean) : [];
  const displayAllergens = Array.isArray(allergens) ? allergens.filter(Boolean) : [];
  const spiceInfo = getSpiceInfo({ isSpicy, spiceLevel });

  return (
    <Dialog open={isOpen} onOpenChange={(value) => (value ? undefined : onClose?.())}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden border-white/20 bg-black p-0 text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{description ?? 'Menu item detail'}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div className="relative h-[52vh] w-full overflow-hidden md:h-[60vh]">
            <img src={heroImage} alt={name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {category ? (
                <Badge className="bg-white/10 backdrop-blur-xl border-white/30 text-white text-sm px-4 py-2 shadow-2xl">
                  {category}
                </Badge>
              ) : null}
              {isSpicy ? (
                <Badge className="bg-red-500/20 text-red-200 border-red-500/40">Spicy</Badge>
              ) : null}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <h1 className="mb-4 text-4xl font-bold drop-shadow-2xl md:text-5xl">{name}</h1>
              <div className="text-5xl font-bold text-transparent drop-shadow-2xl bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 bg-clip-text md:text-6xl">
                {priceLabel}
              </div>
            </div>
          </div>

          <div className="space-y-10 p-8 md:p-12">
            {description ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                  About this dish
                </h3>
                <p className="text-gray-200 text-lg leading-relaxed">{description}</p>
              </div>
            ) : null}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <QuickFactCard
                  icon={<Clock className="h-6 w-6 text-orange-400" />}
                  label="Preparation time"
                  value={prepTimeMin != null ? `${prepTimeMin} minutes` : 'Made to order'}
                />
                <QuickFactCard icon={<span className="text-2xl">⚖️</span>} label="Serving size" value={servingSizeGrams != null ? `${servingSizeGrams} g` : 'Single serving'} />
                <FlavorProfile
                  spiceInfo={spiceInfo}
                  isVegetarian={isVegetarian}
                  isVegan={isVegan}
                  isGlutenFree={isGlutenFree}
                  isSpicy={isSpicy}
                  isHalal={isHalal}
                  isKosher={isKosher}
                  spiceLevel={spiceLevel}
                />
              </div>

              <div className="space-y-6">
                {origin ? (
                  <InfoBlock title="Origin" body={origin} />
                ) : null}
                {availability ? (
                  <InfoBlock title="Availability" body={availability} />
                ) : null}
                {winePairing ? (
                  <InfoBlock title="Pairing suggestion" body={winePairing} />
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <InfoBlock
                title="Nutrition"
                subtitle="Per serving"
                body={
                  <ul className="grid grid-cols-2 gap-3 text-sm text-gray-200">
                    <li>Calories: {calories ?? '—'} kcal</li>
                    <li>Protein: {protein ?? '—'} g</li>
                    <li>Carbs: {carbs ?? '—'} g</li>
                    <li>Fat: {fat ?? '—'} g</li>
                    {sugar != null ? <li>Sugars: {sugar} g</li> : null}
                  </ul>
                }
              />
              {preparationNotes ? <InfoBlock title="Preparation Notes" body={preparationNotes} /> : null}
            </div>

            {displayAllergens.length > 0 ? (
              <InfoBlock
                title="Allergens"
                body={
                  <div className="flex flex-wrap gap-2 text-sm text-red-300">
                    {displayAllergens.map((allergen) => (
                      <span key={allergen} className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1">
                        {allergen}
                      </span>
                    ))}
                  </div>
                }
              />
            ) : null}

            {displayPairings.length > 0 ? (
              <RecommendationSection
                items={displayPairings}
                title="Recommended sips & sides"
                subtitle="Perfect partners chosen by our chef"
              />
            ) : null}

            {chefTip ? <InfoBlock title="Chef's Tip" body={chefTip} /> : null}

            {recommendedItems && recommendedItems.length > 0 ? (
              <RecommendationsSlider items={recommendedItems} />
            ) : null}

            {gallery && gallery.length > 0 ? (
              <div className="space-y-3">
                <AnimatedText
                  text="Gallery"
                  as="h3"
                  className="items-start justify-start"
                  textClassName="text-left text-lg font-semibold text-white"
                  underlineGradient="from-amber-400 via-orange-500 to-pink-500"
                  underlineHeight="h-[2px]"
                  underlineOffset="mt-2"
                />
                <div className="grid gap-3 md:grid-cols-3">
                  {gallery.map((src) => (
                    <img key={src} src={src} alt={`${name} gallery`} className="h-40 w-full rounded-xl object-cover" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface QuickFactCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function QuickFactCard({ icon, label, value }: QuickFactCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-orange-300">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

interface FlavorProfileProps extends DietaryBadgesProps {
  spiceInfo: SpiceInfo;
}

interface DietaryBadgesProps {
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isHalal?: boolean | null;
  isKosher?: boolean | null;
  spiceLevel?: number | null;
}

type SpiceInfo = {
  level: number;
  label: string;
  description: string;
};

function FlavorProfile({ spiceInfo, ...badges }: FlavorProfileProps) {
  const dietaryBadges = <DietaryBadges {...badges} />;
  const hasBadges = Boolean(dietaryBadges);
  const showHeatMeter = spiceInfo.level >= 0;

  if (!showHeatMeter && !hasBadges) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 backdrop-blur-sm shadow-lg">
      <AnimatedText
        text="Flavor & Heat"
        as="h3"
        className="items-start justify-start"
        textClassName="text-left text-lg font-semibold text-white"
        underlineGradient="from-amber-400 via-orange-500 to-pink-500"
        underlineHeight="h-[2px]"
        underlineOffset="mt-2"
      />

      {showHeatMeter ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-white">{spiceInfo.label}</p>
          <p className="text-xs text-gray-300">{spiceInfo.description}</p>
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`h-2 flex-1 rounded-full ${index < spiceInfo.level ? 'bg-gradient-to-r from-orange-400 via-amber-400 to-red-500' : 'bg-white/10'}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {hasBadges ? <div className="mt-4 flex flex-wrap gap-2">{dietaryBadges}</div> : null}
    </div>
  );
}

function DietaryBadges({ isVegetarian, isVegan, isGlutenFree, isSpicy, isHalal, isKosher, spiceLevel }: DietaryBadgesProps) {
  if (!isVegetarian && !isVegan && !isGlutenFree && !isSpicy && !isHalal && !isKosher && !spiceLevel) {
    return null;
  }

  return (
    <>
      {isVegetarian ? (
        <Badge className="border-green-500/40 bg-green-500/10 text-green-300">Vegetarian</Badge>
      ) : null}
      {isVegan ? (
        <Badge className="border-green-600/40 bg-green-600/10 text-green-200">Vegan</Badge>
      ) : null}
      {isGlutenFree ? (
        <Badge className="border-blue-500/40 bg-blue-500/10 text-blue-200">Gluten Free</Badge>
      ) : null}
      {isSpicy ? (
        <Badge className="border-red-500/40 bg-red-500/10 text-red-200">Spicy</Badge>
      ) : null}
      {isHalal ? (
        <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200">Halal</Badge>
      ) : null}
      {isKosher ? (
        <Badge className="border-amber-500/40 bg-amber-500/10 text-amber-200">Kosher</Badge>
      ) : null}
      {spiceLevel ? (
        <Badge className="border-red-500/40 bg-red-500/10 text-red-200">
          {Array.from({ length: spiceLevel }).map((_, index) => (
            <span key={index}>🌶</span>
          ))}
        </Badge>
      ) : null}
    </>
  );
}

interface InfoBlockProps {
  title: string;
  body: ReactNode;
  subtitle?: string;
}

function InfoBlock({ title, body, subtitle }: InfoBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg">
      <AnimatedText
        text={title}
        as="h3"
        className="items-start justify-start"
        textClassName="text-left text-lg font-semibold text-white"
        underlineGradient="from-amber-400 via-orange-500 to-pink-500"
        underlineHeight="h-[2px]"
        underlineOffset="mt-2"
      />
      {subtitle ? <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">{subtitle}</p> : null}
      <div className="mt-3 text-sm leading-relaxed text-gray-200">{body}</div>
    </div>
  );
}

function RecommendationSection({ items, title, subtitle }: { items: string[]; title: string; subtitle?: string }) {
  const suggestions = items.slice(0, 4);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 via-white/5 to-black/40 p-6 backdrop-blur">
      <AnimatedText
        text={title}
        as="h3"
        className="items-start justify-start"
        textClassName="text-left text-lg font-semibold text-white"
        underlineGradient="from-amber-400 via-orange-500 to-pink-500"
        underlineHeight="h-[2px]"
        underlineOffset="mt-2"
      />
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">{subtitle ?? 'Complete the experience'}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {suggestions.map((suggestion) => (
          <span
            key={suggestion}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow"
          >
            <span className="text-xs">🍽</span>
            {suggestion}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecommendationsSlider({ items }: { items: MenuItemCardContent[] }) {
  return (
    <div className="space-y-4">
      <AnimatedText
        text="Recommended to go with"
        as="h3"
        className="items-start justify-start"
        textClassName="text-left text-xl font-semibold text-white"
        underlineGradient="from-amber-400 via-orange-500 to-pink-500"
        underlineHeight="h-[2px]"
        underlineOffset="mt-2"
      />
      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex gap-4 px-1">
          {items.map((recommendation) => (
            <div
              key={recommendation.id}
              className="w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl"
            >
              {recommendation.imageUrl ? (
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={recommendation.imageUrl} alt={recommendation.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <span className="absolute bottom-2 left-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80">
                    {recommendation.category}
                  </span>
                </div>
              ) : null}
              <div className="space-y-2 p-4">
                <h4 className="text-sm font-semibold text-white line-clamp-2">{recommendation.name}</h4>
                <p className="text-xs text-white/60 line-clamp-2">{recommendation.description ?? 'House favourite pairing.'}</p>
                <p className="text-sm font-semibold text-white/90">{formatPrice(recommendation.price, recommendation.currency)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSpiceInfo({ isSpicy, spiceLevel }: { isSpicy?: boolean; spiceLevel?: number | null }): SpiceInfo {
  const normalizedLevel = typeof spiceLevel === 'number' ? Math.max(0, Math.min(5, spiceLevel)) : isSpicy ? 3 : 0;

  if (!isSpicy && (spiceLevel == null || normalizedLevel === 0)) {
    return {
      level: 0,
      label: 'No noticeable heat',
      description: 'Suitable for sensitive palates and kids.',
    };
  }

  const labels: Record<number, { title: string; description: string }> = {
    0: { title: 'No noticeable heat', description: 'Suitable for sensitive palates and kids.' },
    1: { title: 'Gentle warmth', description: 'Barely-there heat with subtle spice notes.' },
    2: { title: 'Mild heat', description: 'Balanced warmth that complements the dish.' },
    3: { title: 'Medium heat', description: 'Noticeable spice for guests who enjoy a kick.' },
    4: { title: 'Bold heat', description: 'Vibrant spice for adventurous diners.' },
    5: { title: 'Fiery heat', description: 'Signature-level spice—pair with a cooling drink.' },
  };

  const clamped = Math.min(5, Math.max(0, normalizedLevel));
  const { title, description } = labels[clamped] ?? labels[0];

  return {
    level: clamped,
    label: title,
    description,
  };
}

function formatPrice(value: number, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
