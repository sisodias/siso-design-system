
import MenuItemSkeleton from "./MenuItemSkeleton";

const MenuLoadingState = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex overflow-x-auto pb-2 gap-2 px-1">
        {Array(4).fill(0).map((_, i) => (
          <div key={`tab-skeleton-${i}`} className="px-4 py-2.5 bg-elementree-light/70 rounded-lg shadow-sm animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="w-24 h-5 bg-gray-200/80 rounded"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(4).fill(0).map((_, index) => (
          <MenuItemSkeleton key={`skeleton-${index}`} delay={index * 150} />
        ))}
      </div>
    </div>
  );
};

export default MenuLoadingState;
