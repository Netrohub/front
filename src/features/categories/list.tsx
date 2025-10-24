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
  Trash2
} from 'lucide-react';

function CategoriesList() {
  // Mock categories data
  const categories = [
    {
      id: 1,
      name: 'Gaming',
      slug: 'gaming',
      description: 'Gaming accounts and digital items',
      product_count: 45,
      status: 'active',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      name: 'Social Media',
      slug: 'social-media',
      description: 'Social media accounts and services',
      product_count: 32,
      status: 'active',
      created_at: '2024-01-20T14:15:00Z',
    },
    {
      id: 3,
      name: 'Digital Services',
      slug: 'digital-services',
      description: 'Digital marketing and design services',
      product_count: 18,
      status: 'active',
      created_at: '2024-02-01T09:45:00Z',
    },
    {
      id: 4,
      name: 'Software',
      slug: 'software',
      description: 'Software licenses and tools',
      product_count: 12,
      status: 'inactive',
      created_at: '2024-02-10T11:30:00Z',
    },
  ];

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
        <Button>
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

export default CategoriesList;
