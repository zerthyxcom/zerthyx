import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface NFTPackage {
  id: string;
  name: string;
  price: number;
  daily_profit_rate: number;
  duration_days: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export function AdminNFT() {
  const [editingPackage, setEditingPackage] = useState<NFTPackage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    daily_profit_rate: "",
    duration_days: "",
    description: "",
    is_active: true,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch NFT packages
  const { data: packages, isLoading } = useQuery({
    queryKey: ["nft-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nft_packages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as NFTPackage[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('nft-packages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nft_packages'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["nft-packages"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NFTPackage> }) => {
      const { error } = await supabase
        .from("nft_packages")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nft-packages"] });
      toast({ title: "Success", description: "NFT package updated successfully" });
      setEditingPackage(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Add package mutation
  const addPackageMutation = useMutation({
    mutationFn: async (packageData: Omit<NFTPackage, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from("nft_packages")
        .insert([packageData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nft-packages"] });
      toast({ title: "Success", description: "NFT package added successfully" });
      setIsAddingNew(false);
      setFormData({
        name: "",
        price: "",
        daily_profit_rate: "",
        duration_days: "",
        description: "",
        is_active: true,
      });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("nft_packages")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nft-packages"] });
      toast({ title: "Success", description: "NFT package deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    const packageData = {
      name: formData.name,
      price: parseFloat(formData.price),
      daily_profit_rate: parseFloat(formData.daily_profit_rate),
      duration_days: parseInt(formData.duration_days),
      description: formData.description,
      is_active: formData.is_active,
    };

    if (editingPackage) {
      updatePackageMutation.mutate({ id: editingPackage.id, updates: packageData });
    } else {
      addPackageMutation.mutate(packageData);
    }
  };

  const startEdit = (pkg: NFTPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      daily_profit_rate: pkg.daily_profit_rate.toString(),
      duration_days: pkg.duration_days.toString(),
      description: pkg.description || "",
      is_active: pkg.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border border-border/40 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  NFT Management
                </CardTitle>
                <CardDescription>
                  Manage NFT packages and their settings
                </CardDescription>
              </div>
            </div>
            
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button className="bg-primary/90 hover:bg-primary shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New NFT Package</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Package Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter package name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (USDT)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daily_profit_rate">Daily Profit Rate</Label>
                    <Input
                      id="daily_profit_rate"
                      type="number"
                      step="0.001"
                      value={formData.daily_profit_rate}
                      onChange={(e) => setFormData({ ...formData, daily_profit_rate: e.target.value })}
                      placeholder="e.g., 0.022"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration_days">Duration (Days)</Label>
                    <Input
                      id="duration_days"
                      type="number"
                      value={formData.duration_days}
                      onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                      placeholder="e.g., 45"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter package description"
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                  <Button 
                    onClick={handleSave} 
                    className="w-full"
                    disabled={addPackageMutation.isPending}
                  >
                    {addPackageMutation.isPending ? "Adding..." : "Add Package"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Package Name</TableHead>
                  <TableHead>Price (USDT)</TableHead>
                  <TableHead>Daily Profit Rate</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages?.map((pkg) => (
                  <TableRow key={pkg.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>${pkg.price}</TableCell>
                    <TableCell>{(pkg.daily_profit_rate * 100).toFixed(2)}%</TableCell>
                    <TableCell>{pkg.duration_days} days</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(pkg)}
                              className="hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit NFT Package</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Package Name</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-price">Price (USDT)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={formData.price}
                                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-rate">Daily Profit Rate</Label>
                                <Input
                                  id="edit-rate"
                                  type="number"
                                  step="0.001"
                                  value={formData.daily_profit_rate}
                                  onChange={(e) => setFormData({ ...formData, daily_profit_rate: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-duration">Duration (Days)</Label>
                                <Input
                                  id="edit-duration"
                                  type="number"
                                  value={formData.duration_days}
                                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-active"
                                  checked={formData.is_active}
                                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label htmlFor="edit-active">Active</Label>
                              </div>
                              <Button 
                                onClick={handleSave} 
                                className="w-full"
                                disabled={updatePackageMutation.isPending}
                              >
                                {updatePackageMutation.isPending ? "Updating..." : "Update Package"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePackageMutation.mutate(pkg.id)}
                          disabled={deletePackageMutation.isPending}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}