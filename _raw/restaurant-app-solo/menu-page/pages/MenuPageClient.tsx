'use client';

/**
 * Menu Page Client Component
 *
 * Renders the menu with interactive category tabs
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/domains/shared/components";
import { Badge } from "@/domains/shared/components";
import { MenuCategory, MenuItem } from "@/domains/customer-facing/menu/shared/data/menu-static";

interface MenuPageClientProps {
  menuData: {
    categories: MenuCategory[];
  };
}

export default function MenuPageClient({ menuData }: MenuPageClientProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  };

  if (!menuData.categories || menuData.categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <p className="text-gray-400">Our menu is currently being updated. Please check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-14 md:py-20 relative z-10">
        {/* Header */}
        <div className="relative text-center py-8 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl -z-10 rounded-3xl border border-white/10"></div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-200 via-amber-200 to-orange-300 bg-clip-text text-transparent mb-3">
            Our Menu
          </h1>
          <p className="text-gray-300 text-lg">
            Discover our handcrafted dishes from Draco Coffee &amp; Eatery
          </p>
        </div>

        {/* Order Button */}
        <div className="flex justify-center mb-8">
          <a
            href="/order"
            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105 px-8 py-6 text-base font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M16 10a4 4 0 0 1-8 0"></path>
              <path d="M3.103 6.034h17.794"></path>
              <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
            </svg>
            Order Online
          </a>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue={menuData.categories[0]?.id} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-10 pb-1 bg-white/5 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-white/10">
            {menuData.categories.map((category, index) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 hover:text-white font-medium px-6 py-3 transition-all rounded-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {menuData.categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6 animate-fade-in">
              {category.description && (
                <p className="text-gray-300 italic pl-4 border-l-2 border-orange-500/50 bg-white/5 backdrop-blur-sm py-3 rounded-r-lg">
                  {category.description}
                </p>
              )}

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                {category.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between py-4 px-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex-1 mr-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="font-serif text-lg font-semibold text-white group-hover:text-orange-200 transition-colors">
                          {item.name}
                        </h3>
                        {item.dietary && (
                          <div className="flex gap-1">
                            {item.dietary.vegetarian && (
                              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300 border-green-500/30 px-1.5 py-0">
                                V
                              </Badge>
                            )}
                            {item.dietary.vegan && (
                              <Badge variant="secondary" className="text-xs bg-green-600/20 text-green-200 border-green-600/30 px-1.5 py-0">
                                VG
                              </Badge>
                            )}
                            {item.dietary.glutenFree && (
                              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30 px-1.5 py-0">
                                GF
                              </Badge>
                            )}
                            {item.dietary.spicy && (
                              <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-300 border-red-500/30 px-1.5 py-0">
                                🌶️
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-orange-400">
                        {item.priceFormatted}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {category.items.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <p>No items in this category yet.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* About Section */}
        <div className="mt-16 max-w-2xl mx-auto bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-xl shadow-sm border border-white/10">
          <h3 className="text-xl font-medium mb-4 text-orange-200">About Our Menu</h3>
          <p className="mb-4 text-gray-300">
            Located in Bali, Draco Coffee & Eatery offers authentic cuisine using traditional recipes
            passed down through generations.
          </p>
          <p className="mb-4 text-gray-300">
            We use locally sourced ingredients and offer a range of options for various dietary preferences.
          </p>
          <p className="mb-4 text-gray-300">
            For any special dietary needs or inquiries, please contact us or ask your server for assistance.
          </p>
          <div className="flex justify-center mt-6">
            <a
              href="/order"
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-full shadow-md transform transition-transform hover:scale-105 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M16 10a4 4 0 0 1-8 0"></path>
                <path d="M3.103 6.034h17.794"></path>
                <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
              </svg>
              Order Online Now
            </a>
          </div>
        </div>
      </div>

      {/* Simple Item Detail Modal (optional - can be removed if not needed) */}
      {selectedItem && isDialogOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseDialog}
        >
          <div
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h2>
            <p className="text-gray-300 mb-4">{selectedItem.description}</p>
            <div className="text-2xl font-bold text-orange-400 mb-4">
              {selectedItem.priceFormatted}
            </div>
            <button
              onClick={handleCloseDialog}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-lg px-4 py-2 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
