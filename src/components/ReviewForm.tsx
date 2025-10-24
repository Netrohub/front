import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit?: (review: { rating: number; comment: string }) => void;
  onCancel?: () => void;
}

const ReviewForm = ({ productId, productName, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Review Too Short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSubmit?.({ rating, comment });

    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });

    // Reset form
    setRating(0);
    setComment("");
    setIsSubmitting(false);
  };

  return (
    <Card className="glass-card p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Write a Review</h3>
          <p className="text-sm text-foreground/60">Reviewing: {productName}</p>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-foreground">Your Rating *</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-foreground/20"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-foreground/60">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Very Good"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="review-comment" className="text-base font-semibold text-foreground">
            Your Review *
          </Label>
          <Textarea
            id="review-comment"
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[150px] glass-card border-primary/30 focus:border-primary/50"
            disabled={isSubmitting}
          />
          <p className="text-xs text-foreground/60">
            {comment.length}/1000 characters {comment.length < 10 && "(minimum 10 characters)"}
          </p>
        </div>

        {/* Guidelines */}
        <div className="p-4 glass-card rounded-lg border border-primary/20 bg-primary/5">
          <h4 className="text-sm font-semibold text-foreground mb-2">Review Guidelines</h4>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>• Be honest and specific about your experience</li>
            <li>• Focus on the product quality and seller service</li>
            <li>• Avoid profanity and personal attacks</li>
            <li>• Include relevant details to help other buyers</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 btn-glow"
            disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="glass-card border-primary/30"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
