"use client";

import Image from 'next/image';
import { Flame, Leaf, Wheat, Clock } from 'lucide-react';
import { AnimatedText, Badge } from '@/domains/shared/components';
import { getMenuItemImage } from '@/domains/customer-facing/menu/shared/utils/menu-images';
import type { MenuItem } from '@/domains/customer-facing/menu/shared/types';
import type { MenuItemCardContent } from '../../types';

interface Props extends MenuItemCardContent {
  onSelectItem?: (itemId: string) => void;
}

function formatPrice(amount: number, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MenuItemCardPrimary({
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
  servingSizeGrams,
  isHalal,
  isKosher,
  allergens,
  pairings,
  chefTip,
  popularScore,
  badges,
  onSelectItem,
}: Props) {
  const handleSelect = () => onSelectItem?.(id);
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
    popular_score: popularScore ?? 0,
  };

  const image = imageUrl ?? getMenuItemImage(fallbackItem, 'card');

  const statusPills = [
    popularScore != null && popularScore >= 90
      ? { label: 'Best Seller', highlight: true }
      : null,
    ...(badges ?? []).map((badge) => ({ label: badge, highlight: false })),
  ].filter(Boolean) as Array<{ label: string; highlight: boolean }>;

  const dietaryBadges = [
    isSpicy ? { icon: <Flame className="w-3.5 h-3.5 text-red-400" />, label: 'Spicy' } : null,
    isVegetarian && !isVegan ? { label: 'Vegetarian' } : null,
    isVegan ? { label: 'Vegan' } : null,
    isGlutenFree ? { label: 'Gluten Free' } : null,
  ].filter(Boolean) as Array<{ icon?: JSX.Element; label: string }>;

  const nutritionChips = [
    { label: '⚡', value: calories != null ? `${calories} cal` : null },
    { label: '🥩', value: protein != null ? `${protein}g protein` : null },
    { label: '🍚', value: carbs != null ? `${carbs}g carbs` : null },
    { label: '🧁', value: sugar != null ? `${sugar}g sugar` : null },
    { label: '🧈', value: fat != null ? `${fat}g fat` : null },
    { label: '⏱', value: prepTimeMin != null ? `${prepTimeMin}m` : null },
    { label: '≈', value: servingSizeGrams != null ? `${servingSizeGrams}g` : null },
  ].filter((chip) => chip.value);

  const allergenChips = (allergens ?? [])
    .filter(Boolean)
    .slice(0, 3)
    .map((code) => {
      switch (code.toLowerCase()) {
        case 'nuts':
          return '🥜 Nuts';
        case 'dairy':
          return '🥛 Dairy';
        case 'gluten':
          return '🌾 Gluten';
        case 'shellfish':
          return '🍤 Shellfish';
        case 'egg':
        case 'eggs':
          return '🥚 Egg';
        default:
          return code;
      }
    });

  return (
    <div
      className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/12 bg-black/70 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(255,152,56,0.25)]"
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelect();
        }
      }}
    >
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
          {category ?? 'Menu'}
        </span>
        {statusPills.length > 0 ? (
          <div className="flex items-center gap-2">
            {statusPills.map(({ label, highlight }) => (
              <Badge
                key={label}
                className={highlight
                  ? 'border border-amber-200/70 bg-amber-400/90 text-[11px] font-semibold text-black'
                  : 'border border-white/15 bg-white/12 text-[11px] text-white/85'}
              >
                {label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative mt-4 h-[240px] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 90vw, 420px"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        <div className="absolute top-3 right-3 flex gap-1.5">
          {isSpicy ? (
            <div className="h-7 w-7 rounded-full border border-red-500/30 bg-red-500/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Flame className="h-3.5 w-3.5 text-red-400" />
            </div>
          ) : null}
          {isVegetarian ? (
            <div className="h-7 w-7 rounded-full border border-green-500/30 bg-green-500/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Leaf className="h-3.5 w-3.5 text-green-400" />
            </div>
          ) : null}
          {isGlutenFree ? (
            <div className="h-7 w-7 rounded-full border border-blue-500/30 bg-blue-500/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Wheat className="h-3.5 w-3.5 text-blue-400" />
            </div>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
          {formatPrice(price, currency)}
        </div>

      </div>

      <div className="space-y-3 border-t border-white/10 bg-black/40 p-5">
        <div className="space-y-1">
          <AnimatedText
            text={name}
            as="h3"
            className="items-start justify-start gap-1"
            textClassName="text-left text-lg font-semibold text-white/95"
            underlineGradient="from-amber-400 via-orange-500 to-pink-500"
            underlineHeight="h-[2px]"
            underlineOffset="mt-1"
          />
          {description ? (
            <p className="text-xs text-white/60 line-clamp-2">
              {description}
            </p>
          ) : null}
        </div>

        {prepTimeMin != null ? (
          <div className="flex items-center gap-1 text-xs text-gray-300">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{prepTimeMin} min</span>
          </div>
        ) : null}

        {dietaryBadges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {dietaryBadges.map(({ icon, label }) => (
              <Badge key={label} className="flex items-center gap-1 border-white/20 bg-white/10 text-[11px] text-white/90">
                {icon}
                {label}
              </Badge>
            ))}
            {isHalal ? (
              <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[11px] text-emerald-300">Halal</Badge>
            ) : null}
            {isKosher ? (
              <Badge className="border-amber-500/20 bg-amber-500/10 text-[11px] text-amber-300">Kosher</Badge>
            ) : null}
            {spiceLevel ? (
              <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] text-red-300">
                {Array.from({ length: spiceLevel }).map((_, idx) => (
                  <span key={idx}>🌶</span>
                ))}
              </span>
            ) : null}
          </div>
        ) : null}

        {nutritionChips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {nutritionChips.map(({ label, value }) => (
              <span key={`${label}-${value}`} className="rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white/90">
                {label} {value}
              </span>
            ))}
          </div>
        ) : null}

        {allergenChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400">
            <span>Allergens:</span>
            {allergenChips.map((chip) => (
              <span key={chip} className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-red-300">
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        {pairings && pairings.length > 0 ? (
          <p className="text-[11px] text-gray-400">Pairs with: {pairings.slice(0, 2).join(', ')}</p>
        ) : null}
        {chefTip ? (
          <p className="text-[11px] italic text-gray-500">Chef tip: {chefTip}</p>
        ) : null}
      </div>
    </div>
  );
}
