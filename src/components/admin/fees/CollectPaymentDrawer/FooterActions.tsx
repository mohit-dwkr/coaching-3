import { Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterActionsProps {
  loading?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function FooterActions({
  loading = false,
  onClose,
  onSubmit,
}: FooterActionsProps) {
  return (
    <div className="border-t bg-white p-4 flex items-center justify-end gap-3">

      <Button
        variant="outline"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>

      <Button
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Collecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Collect Payment
          </>
        )}
      </Button>

    </div>
  );
}