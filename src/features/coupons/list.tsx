import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  
  // Form state
  const [couponCode, setCouponCode] = useState('');
  const [couponDescription, setCouponDescription] = useState('');
  const [couponType, setCouponType] = useState('percentage');
  const [couponValue, setCouponValue] = useState('');
  const [couponStatus, setCouponStatus] = useState('active');
  
  // TODO: Replace with actual coupons data from API
  const coupons = [];

  const handleAddCoupon = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddSubmit = async () => {
    // TODO: Call API to create coupon
    toast.success('Coupon created', {
      description: `Coupon "${couponCode}" has been created successfully.`,
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleViewCoupon = (couponId: string) => {
    toast.info('Viewing coupon', {
      description: `Opening coupon #${couponId}`,
    });
  };

  const handleEditCoupon = (couponId: string) => {
    const coupon = coupons.find((c: any) => c.id === couponId);
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponCode(coupon.code);
      setCouponDescription(coupon.description);
      setCouponType(coupon.type);
      setCouponValue(coupon.value);
      setCouponStatus(coupon.status);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSubmit = async () => {
    // TODO: Call API to update coupon
    toast.success('Coupon updated', {
      description: `Coupon "${couponCode}" has been updated successfully.`,
    });
    setIsEditDialogOpen(false);
    setEditingCoupon(null);
    resetForm();
  };

  const handleDeleteClick = (couponId: string) => {
    setCouponToDelete(couponId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;
    
    // TODO: Call API to delete coupon
    toast.success('Coupon deleted', {
      description: 'Coupon has been deleted successfully.',
    });
    setDeleteDialogOpen(false);
    setCouponToDelete(null);
  };

  const resetForm = () => {
    setCouponCode('');
    setCouponDescription('');
    setCouponType('percentage');
    setCouponValue('');
    setCouponStatus('active');
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCoupon}>
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Coupon</DialogTitle>
              <DialogDescription>
                Create a new discount coupon
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g., WELCOME10"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Coupon Type</Label>
                  <Select value={couponType} onValueChange={setCouponType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="dollar">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="value">Discount Value *</Label>
                <Input
                  id="value"
                  type="number"
                  value={couponValue}
                  onChange={(e) => setCouponValue(e.target.value)}
                  placeholder={couponType === 'percentage' ? "e.g., 10" : "e.g., 5.00"}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={couponDescription}
                  onChange={(e) => setCouponDescription(e.target.value)}
                  placeholder="Coupon description..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={couponStatus} onValueChange={setCouponStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubmit}>
                  Create Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>
              Update coupon information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-code">Coupon Code *</Label>
                <Input
                  id="edit-code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g., WELCOME10"
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Coupon Type</Label>
                <Select value={couponType} onValueChange={setCouponType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="dollar">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-value">Discount Value *</Label>
              <Input
                id="edit-value"
                type="number"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                placeholder={couponType === 'percentage' ? "e.g., 10" : "e.g., 5.00"}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={couponDescription}
                onChange={(e) => setCouponDescription(e.target.value)}
                placeholder="Coupon description..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={couponStatus} onValueChange={setCouponStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSubmit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search coupons..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No coupons found
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon: any) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{coupon.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {coupon.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.type === 'percentage' ? (
                        <Percent className="w-3 h-3 mr-1" />
                      ) : (
                        <span>$</span>
                      )}
                      {coupon.value}{coupon.type === 'percentage' ? '%' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{coupon.usage_count || 0} / {coupon.max_usage || '∞'}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                  <TableCell>
                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewCoupon(coupon.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCoupon(coupon.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(coupon.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default CouponsList;
