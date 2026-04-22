'use client';

/**
 * Simple Accordion Menu - Like the screenshot
 * Click category to expand/collapse
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MenuCategory } from "@/domains/customer-facing/menu/shared/data/draco-menu";

interface MenuAccordionProps {
  categories: MenuCategory[];
}

export default function MenuAccordion({ categories }: MenuAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-2">
      {categories.map((category) => {
        const isOpen = openCategory === category.id;

        return (
          <div
            key={category.id}
            className="rounded-lg overflow-hidden border border-white/10"
          >
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-4 flex items-center justify-between transition-all"
            >
              <span className="text-lg font-bold uppercase tracking-wide">
                {category.emoji && <span className="mr-2">{category.emoji}</span>}
                {category.name}
              </span>
              {isOpen ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>

            {/* Category Items */}
            {isOpen && (
              <div className="bg-white divide-y divide-gray-200">
                {category.items.map((item, index) => (
                  <div
                    key={index}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="font-semibold text-gray-900">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
