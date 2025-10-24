import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvidenceUpload } from "./EvidenceUpload";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface DisputeFormProps {
  orderId?: string;
  onSubmit: (data: {
    orderId: string;
    reason: string;
    description: string;
    files: UploadedFile[];
  }) => void;
}

const disputeReasons = [
  "Product not as described",
  "Account not working",
  "Missing account details",
  "Security concerns",
  "Fraud or scam",
  "Other issue",
];

export const DisputeForm = ({ orderId: initialOrderId, onSubmit }: DisputeFormProps) => {
  const [orderId, setOrderId] = useState(initialOrderId || "");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ orderId, reason, description, files });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="glass-card p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="orderId">Order ID</Label>
          <Select value={orderId} onValueChange={setOrderId} required>
            <SelectTrigger className="glass-card border-border/50">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/50">
              <SelectItem value="ORD-001">Order #ORD-001</SelectItem>
              <SelectItem value="ORD-002">Order #ORD-002</SelectItem>
              <SelectItem value="ORD-003">Order #ORD-003</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Dispute Reason</Label>
          <Select value={reason} onValueChange={setReason} required>
            <SelectTrigger className="glass-card border-border/50">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent className="glass-card border-border/50">
              {disputeReasons.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe your issue in detail (minimum 20 characters)"
            className="glass-card border-border/50 min-h-[120px]"
            required
            minLength={20}
          />
          <p className="text-xs text-foreground/60">
            {description.length}/20 characters minimum
          </p>
        </div>
      </Card>

      <EvidenceUpload files={files} onFilesChange={setFiles} />

      <Button
        type="submit"
        size="lg"
        className="w-full btn-glow"
        disabled={!orderId || !reason || description.length < 20}
      >
        Submit Dispute
      </Button>
    </form>
  );
};
