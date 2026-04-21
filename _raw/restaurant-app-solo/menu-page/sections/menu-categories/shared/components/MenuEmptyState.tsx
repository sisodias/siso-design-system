
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/domains/shared/components";
import { Info } from "lucide-react";
import Link from "next/link";

type MenuEmptyStateProps = {
  isSignedIn: boolean;
};

const MenuEmptyState = ({ isSignedIn }: MenuEmptyStateProps) => {
  return (
    <Alert className="mb-6 border border-elementree-water/20 bg-elementree-light/50 backdrop-blur-sm animate-fade-in shadow-md rounded-xl">
      <Info className="h-5 w-5 text-elementree-water" />
      <AlertDescription className="flex flex-col items-center py-6">
        <div className="mb-6 text-center font-medium">
          {isSignedIn 
            ? "No menu items found. Click the 'Seed Menu Data' button above to add sample menu data." 
            : "Please sign in to add menu data."}
        </div>
        {!isSignedIn && (
          <Button asChild size="sm" className="bg-elementree-water hover:bg-elementree-water/90 rounded-full shadow-sm transition-all hover:shadow-md">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default MenuEmptyState;
