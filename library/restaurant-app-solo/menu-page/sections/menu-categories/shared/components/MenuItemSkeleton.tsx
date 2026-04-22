
import { Skeleton } from "@/domains/shared/components";
import { Card, CardContent } from "@/domains/shared/components";

type MenuItemSkeletonProps = {
  delay?: number;
};

const MenuItemSkeleton = ({ delay = 0 }: MenuItemSkeletonProps) => {
  return (
    <Card className="overflow-hidden border-elementree-light/50 group shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-32 md:h-auto relative overflow-hidden">
          <Skeleton className="h-full w-full" style={{ animationDelay: `${delay}ms` }} />
        </div>
        <CardContent className="p-4 flex-1 w-full">
          <div className="flex justify-between items-start">
            <div className="w-3/4">
              <Skeleton className="h-6 w-32 mb-2" style={{ animationDelay: `${delay + 50}ms` }} />
              <Skeleton className="h-4 w-full mb-1" style={{ animationDelay: `${delay + 100}ms` }} />
              <Skeleton className="h-4 w-2/3" style={{ animationDelay: `${delay + 150}ms` }} />
            </div>
            <Skeleton className="h-5 w-14 ml-4" style={{ animationDelay: `${delay + 200}ms` }} />
          </div>
          <div className="flex flex-wrap gap-1 mt-4">
            <Skeleton className="h-5 w-16 rounded-full" style={{ animationDelay: `${delay + 250}ms` }} />
            <Skeleton className="h-5 w-16 rounded-full" style={{ animationDelay: `${delay + 300}ms` }} />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MenuItemSkeleton;
