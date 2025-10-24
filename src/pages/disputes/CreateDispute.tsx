import { useNavigate, useSearchParams } from "react-router-dom";
import AccountLayout from "@/components/AccountLayout";
import { DisputeForm } from "@/components/disputes/DisputeForm";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const CreateDispute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || undefined;

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Dispute submitted:", data);
    toast.success("Dispute created successfully!");
    navigate("/disputes");
  };

  return (
    <AccountLayout>
          <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-black text-foreground mb-2">Create Dispute</h1>
              <p className="text-foreground/60">
                Fill out the form below to open a dispute for your order
              </p>
            </div>

            {/* Info Card */}
            <Card className="glass-card p-6 border-blue-500/30 bg-blue-500/5">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <h3 className="font-bold text-foreground">Before Opening a Dispute</h3>
                  <ul className="space-y-1 text-foreground/70">
                    <li>• Try contacting the seller first through order messages</li>
                    <li>• Gather evidence (screenshots, photos, documents)</li>
                    <li>• Provide a detailed description of the issue</li>
                    <li>• Our team will review and respond within 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Form */}
            <DisputeForm orderId={orderId} onSubmit={handleSubmit} />
          </div>
    </AccountLayout>
  );
};

export default CreateDispute;
