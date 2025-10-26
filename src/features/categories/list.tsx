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
  Trash2
} from 'lucide-react';

function CategoriesList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // TODO: Replace with actual categories data from API
  const categories = [];

  const handleAddCategory = () => {
    toast.info('Add Category', {
      description: 'Opening add category form...',
    });
    // TODO: Open add category modal or navigate to create page
  };

  const handleViewCategory = (categoryId: string) => {
    toast.info('Viewing category', {
      description: `Opening category #${categoryId}`,
    });
    // TODO: Navigate to category detail page
  };

  const handleEditCategory = (categoryId: string) => {
    toast.info('Editing category', {
      description: `Opening edit form for #${categoryId}`,
    });
    // TODO: Open edit category modal or navigate to edit page
  };

  const handleDeleteCategory = (categoryId: string) => {
    toast.error('Delete Category', {
      description: 'Category deletion not implemented yet.',
    });
    // TODO: Implement delete functionality with confirmation dialog
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Categories Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {category.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{category.product_count}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(category.status)}</TableCell>
                <TableCell>
                  {new Date(category.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewCategory(category.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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

export default CategoriesList;
