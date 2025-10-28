import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const StatCardSkeleton = () => (
  <Card className="glass-card p-4">
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  </Card>
);

export const OrderCardSkeleton = () => (
  <Card className="glass-card p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </Card>
);

export const OverviewTabSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Grid Skeleton */}
    <div>
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    </div>

    {/* Quick Actions Skeleton */}
    <Card className="glass-card p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </Card>
      </div>
    </Card>
  </div>
);

export const BuyerTabSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Recent Orders Section */}
    <Card className="glass-card p-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-3">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </Card>
  </div>
);

export const SellerTabSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Products Section */}
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-3">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </Card>
  </div>
);

