import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminUsers() {
  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ["admin-users-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, email, full_name, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: wallets, isLoading: loadingWallets } = useQuery({
    queryKey: ["admin-users-wallets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_wallets")
        .select("user_id, main_balance, nft_balance, total_deposited, total_withdrawn");
      if (error) throw error;
      return data || [];
    },
  });

  const walletMap = useMemo(() => {
    const map = new Map<string, { main_balance: number; nft_balance: number; total_deposited: number; total_withdrawn: number }>();
    wallets?.forEach(w => map.set(w.user_id, {
      main_balance: Number(w.main_balance || 0),
      nft_balance: Number(w.nft_balance || 0),
      total_deposited: Number(w.total_deposited || 0),
      total_withdrawn: Number(w.total_withdrawn || 0),
    }));
    return map;
  }, [wallets]);

  if (loadingProfiles || loadingWallets) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48"></div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage registered users and balances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Details</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((user) => {
                const w = walletMap.get(user.user_id);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">{user.email || "-"}</p>
                        <p className="text-xs text-muted-foreground font-mono">ID: {user.user_id?.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Main: ${w?.main_balance?.toLocaleString?.() || 0}</div>
                        <div>NFT: ${w?.nft_balance?.toLocaleString?.() || 0}</div>
                        <div>Deposited: ${w?.total_deposited?.toLocaleString?.() || 0}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                        {user.status || "active"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
