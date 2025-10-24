import { useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp
} from "lucide-react";

const products = [
  {
    id: "1",
    name: "Steam Account - 500+ Games Library",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    category: "Gaming",
    price: 599.99,
    stock: 5,
    sales: 45,
    views: 1250,
    status: "active",
  },
  {
    id: "2",
    name: "Instagram Account - 100K Followers",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    category: "Social Media",
    price: 549.99,
    stock: 3,
    sales: 32,
    views: 980,
    status: "active",
  },
  {
    id: "3",
    name: "PlayStation Plus Premium - 3 Years",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    category: "Gaming",
    price: 349.99,
    stock: 0,
    sales: 28,
    views: 756,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: "Twitter Verified Account",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&q=80",
    category: "Social Media",
    price: 899.99,
    stock: 2,
    sales: 15,
    views: 542,
    status: "draft",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          Active
        </Badge>
      );
    case "out_of_stock":
      return (
        <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
          Out of Stock
        </Badge>
      );
    case "draft":
      return (
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          Draft
        </Badge>
      );
    default:
      return null;
  }
};

const SellerProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productsList, setProductsList] = useState(products);

  const handleView = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleEdit = (productId: string) => {
    navigate(`/seller/products/${productId}/edit`);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      // Remove product from list
      setProductsList(prev => prev.filter(p => p.id !== productToDelete));
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCreateProduct = () => {
    // Redirect to onboarding instead of create
    navigate("/seller/onboarding");
  };

  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              My Products
            </h1>
            <p className="text-foreground/60">Manage your product listings</p>
          </div>
          <Button className="btn-glow" onClick={handleCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="glass-card p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
              <Input
                placeholder="Search products..."
                className="pl-10 glass-card border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className={`glass-card border-border/50 ${filterStatus === 'all' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Products
            </Button>
            <Button 
              variant="outline" 
              className={`glass-card border-border/50 ${filterStatus === 'active' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </Button>
            <Button 
              variant="outline" 
              className={`glass-card border-border/50 ${filterStatus === 'draft' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => setFilterStatus('draft')}
            >
              Draft
            </Button>
          </div>
        </Card>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="glass-card p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1">
                          {product.name}
                        </h3>
                        {getStatusBadge(product.status)}
                      </div>
                      <p className="text-sm text-foreground/60 mb-2">
                        Category: {product.category}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-foreground/60">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span>{product.sales} sold</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-primary" />
                          <span>{product.views} views</span>
                        </div>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-card border-border/50"
                      onClick={() => handleView(product.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-card border-border/50"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-card border-border/50 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="glass-card p-12 text-center">
            <div className="inline-flex p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {searchQuery ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-foreground/60 mb-6">
              {searchQuery 
                ? 'Try adjusting your search or filters' 
                : 'Create your first product to start selling'}
            </p>
            {!searchQuery && (
              <Button className="btn-glow" onClick={handleCreateProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            )}
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="glass-card border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                from your listings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SellerLayout>
  );
};

export default SellerProducts;
