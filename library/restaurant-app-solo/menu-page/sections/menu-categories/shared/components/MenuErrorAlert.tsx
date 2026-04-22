
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type MenuErrorAlertProps = {
  error: Error | null;
};

const MenuErrorAlert = ({ error }: MenuErrorAlertProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6 animate-fade-in shadow-md border-elementree-fire/20">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center font-medium">
        Error loading menu data. Please try again later or contact support.
      </AlertDescription>
    </Alert>
  );
};

export default MenuErrorAlert;
