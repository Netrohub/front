import React from 'react';
import { useList } from '@refinedev/core';
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
  Package,
  Star,
  TrendingUp
} from 'lucide-react';

function ListingsList() {
  const { data, isLoading } = useList({
    resource: 'listings',
    pagination: { current: 1, pageSize: 10 },
  });

  // Mock listings data
  const listings = [
    {
      id: 1,
      title: 'Premium Instagram Account',
      slug: 'premium-instagram-account',
      seller: 'Sarah Johnson',
      price: 150.00,
      stock: 1,
      status: 'active',
      category: 'Social Media',
      rating: 4.8,
      sales_count: 23,
      created_at: '2024-02-20T14:15:00Z',
    },
    {
      id: 2,
      title: 'Gaming Account - Level 100',
      slug: 'gaming-account-level-100',
      seller: 'Mike Wilson',
      price: 75.50,
      stock: 3,
      status: 'pending',
      category: 'Gaming',
      rating: 4.5,
      sales_count: 12,
      created_at: '2024-03-10T09:45:00Z',
    },
    {
      id: 3,
      title: 'Digital Marketing Course',
      slug: 'digital-marketing-course',
      seller: 'Tech Solutions Ltd',
      price: 299.99,
      stock: 0,
      status: 'rejected',
      category: 'Education',
      rating: 0,
      sales_count: 0,
      created_at: '2024-01-15T11:30:00Z',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Listings</h1>
          <p className="text-muted-foreground">Manage product listings and approvals</p>
        </div>
        <Button>
          <Package className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search listings..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Listings Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{listing.title}</div>
                    <div className="text-sm text-muted-foreground">{listing.category}</div>
                  </div>
                </TableCell>
                <TableCell>{listing.seller}</TableCell>
                <TableCell>${listing.price.toFixed(2)}</TableCell>
                <TableCell>{listing.stock}</TableCell>
                <TableCell>{getStatusBadge(listing.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{listing.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>{listing.sales_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
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

export default ListingsList;
