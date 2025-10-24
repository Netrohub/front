import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  // Mock coupons data
  const coupons = [
    {
      id: 1,
      code: 'WELCOME10',
      description: 'Welcome discount for new users',
      type: 'percentage',
      value: 10,
      min_amount: 50,
      max_discount: 25,
      usage_limit: 100,
      used_count: 23,
      status: 'active',
      expires_at: '2024-12-31T23:59:59Z',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      code: 'SAVE20',
      description: 'Flat discount for orders over $100',
      type: 'fixed',
      value: 20,
      min_amount: 100,
      max_discount: null,
      usage_limit: 50,
      used_count: 12,
      status: 'active',
      expires_at: '2024-06-30T23:59:59Z',
      created_at: '2024-02-01T14:15:00Z',
    },
    {
      id: 3,
      code: 'EXPIRED5',
      description: 'Expired coupon',
      type: 'percentage',
      value: 5,
      min_amount: 25,
      max_discount: 10,
      usage_limit: 200,
      used_count: 45,
      status: 'expired',
      expires_at: '2024-01-31T23:59:59Z',
      created_at: '2023-12-01T09:45:00Z',
    },
  ];

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
        <Button>
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
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
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
