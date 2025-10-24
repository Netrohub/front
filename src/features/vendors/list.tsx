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
  CheckCircle, 
  XCircle, 
  Eye,
  User
} from 'lucide-react';

function VendorsList() {
  const { data, isLoading } = useList({
    resource: 'vendors',
    pagination: { current: 1, pageSize: 10 },
  });

  // Mock vendors data
  const vendors = [
    {
      id: 1,
      user_id: 2,
      display_name: 'Sarah Johnson',
      email: 'sarah@nxoland.com',
      kyc_status: 'verified',
      business_type: 'Individual',
      created_at: '2024-02-20T14:15:00Z',
      notes: 'Premium seller with excellent ratings',
    },
    {
      id: 2,
      user_id: 3,
      display_name: 'Mike Wilson',
      email: 'mike@nxoland.com',
      kyc_status: 'pending',
      business_type: 'Business',
      created_at: '2024-03-10T09:45:00Z',
      notes: 'New vendor awaiting verification',
    },
    {
      id: 3,
      user_id: 4,
      display_name: 'Tech Solutions Ltd',
      email: 'contact@techsolutions.com',
      kyc_status: 'rejected',
      business_type: 'Corporation',
      created_at: '2024-01-15T11:30:00Z',
      notes: 'KYC documents incomplete',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor accounts and verifications</p>
        </div>
        <Button>
          <User className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search vendors..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Vendors Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{vendor.display_name}</div>
                    <div className="text-sm text-muted-foreground">{vendor.email}</div>
                  </div>
                </TableCell>
                <TableCell>{vendor.business_type}</TableCell>
                <TableCell>{getStatusBadge(vendor.kyc_status)}</TableCell>
                <TableCell>
                  {new Date(vendor.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {vendor.notes}
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

export default VendorsList;
