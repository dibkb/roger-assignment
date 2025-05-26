import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Wand,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatusButtonProps } from "./types";

export const StatusButton = ({
  status,
  onClick,
  disabled,
  error,
}: StatusButtonProps) => {
  const getStatusIcon = () => {
    if (disabled) {
      return <Wand className="w-4 h-4 text-gray-400" />;
    }

    switch (status.status) {
      case "updating":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "updated":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Wand className="w-4 h-4" />;
    }
  };

  const getStatusLabel = () => {
    if (disabled) {
      return "No empty values to update";
    }

    switch (status.status) {
      case "updating":
        return "Updating row...";
      case "updated":
        return "Row updated";
      case "error":
        return status.error || "Error updating row";
      default:
        return "Update row";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={status.status === "updating" || disabled}
        className={`p-1 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label={getStatusLabel()}
      >
        {getStatusIcon()}
      </Button>
      {status.status === "error" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
