import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  Tag,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Percent
} from 'lucide-react';

function CouponsList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // TODO: Replace with actual coupons data from API
  const coupons = [];

  const handleAddCoupon = () => {
    toast.info('Add Coupon', {
      description: 'Opening add coupon form...',
    });
  };

  const handleViewCoupon = (couponId: string) => {
    toast.info('Viewing coupon', {
      description: `Opening coupon #${couponId}`,
    });
  };

  const handleEditCoupon = (couponId: string) => {
    toast.info('Editing coupon', {
      description: `Opening edit form for #${couponId}`,
    });
  };

  const handleDeleteCoupon = (couponId: string) => {
    toast.error('Delete Coupon', {
      description: 'Coupon deletion not implemented yet.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatValue = (coupon: any) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    } else {
      return `$${coupon.value}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coupons</h1>
          <p className="text-muted-foreground">Manage discount coupons and promotions</p>
        </div>
        <Button onClick={handleAddCoupon}>
          <Plus className="w-4 h-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search coupons..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Coupons Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="font-mono font-medium">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {coupon.description}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {coupon.type === 'percentage' ? (
                      <Percent className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <span className="text-muted-foreground">$</span>
                    )}
                    <span className="font-medium">{formatValue(coupon)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{coupon.used_count} / {coupon.usage_limit}</div>
                    <div className="text-muted-foreground">
                      {Math.round((coupon.used_count / coupon.usage_limit) * 100)}% used
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewCoupon(coupon.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditCoupon(coupon.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCoupon(coupon.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default CouponsList;
