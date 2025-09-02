import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Gem } from "lucide-react";

interface NFTPackage {
  id: string;
  name: string;
  price: number;
  daily_profit_rate: number;
  duration_days: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Add package mutation
  const addPackageMutation = useMutation({
    mutationFn: async (packageData: Omit<NFTPackage, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase
        .from("nft_packages")
        .insert([packageData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nft-packages"] });
      toast({ title: "Success", description: "NFT package added successfully" });
      setIsAddingNew(false);
      resetForm();
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

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      daily_profit_rate: "",
      duration_days: "",
      description: "",
      is_active: true,
    });
  };

  const handleSave = () => {
    const packageData = {
      name: formData.name,
      price: parseFloat(formData.price),
      daily_profit_rate: parseFloat(formData.daily_profit_rate),
      duration_days: parseInt(formData.duration_days),
      description: formData.description || null,
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            NFT Package Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage NFT investment packages</p>
        </div>
        
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add NFT Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-primary" />
                Add New NFT Package
              </DialogTitle>
              <DialogDescription>
                Create a new NFT investment package for users
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Package Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Starter NFT"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (USDT)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate">Daily Profit Rate</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.001"
                  value={formData.daily_profit_rate}
                  onChange={(e) => setFormData({ ...formData, daily_profit_rate: e.target.value })}
                  placeholder="0.022"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  placeholder="45"
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Package description..."
                  rows={3}
                />
              </div>
              
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active Package</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddingNew(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={addPackageMutation.isPending}>
                {addPackageMutation.isPending ? "Adding..." : "Add Package"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm">
        <CardHeader className="border-b border-border/40">
          <CardTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            NFT Packages
          </CardTitle>
          <CardDescription>
            Manage all NFT investment packages available to users
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead>Package Name</TableHead>
                <TableHead>Price (USDT)</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages?.map((pkg) => (
                <TableRow key={pkg.id} className="border-border/40">
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell>${pkg.price.toFixed(2)}</TableCell>
                  <TableCell>{(pkg.daily_profit_rate * 100).toFixed(2)}%</TableCell>
                  <TableCell>{pkg.duration_days} days</TableCell>
                  <TableCell>
                    <Badge variant={pkg.is_active ? "default" : "secondary"}>
                      {pkg.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(pkg.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(pkg)}
                            className="hover:bg-primary/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit NFT Package</DialogTitle>
                            <DialogDescription>
                              Update the NFT package details
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Package Name</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-price">Price (USDT)</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-rate">Daily Profit Rate</Label>
                              <Input
                                id="edit-rate"
                                type="number"
                                step="0.001"
                                value={formData.daily_profit_rate}
                                onChange={(e) => setFormData({ ...formData, daily_profit_rate: e.target.value })}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-duration">Duration (Days)</Label>
                              <Input
                                id="edit-duration"
                                type="number"
                                value={formData.duration_days}
                                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                              />
                            </div>
                            
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                            
                            <div className="col-span-2 flex items-center space-x-2">
                              <Switch
                                id="edit-active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                              />
                              <Label htmlFor="edit-active">Active Package</Label>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingPackage(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={updatePackageMutation.isPending}>
                              {updatePackageMutation.isPending ? "Updating..." : "Update Package"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePackageMutation.mutate(pkg.id)}
                        className="hover:bg-destructive/10 text-destructive"
                        disabled={deletePackageMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!packages?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No NFT packages found. Add your first package to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}