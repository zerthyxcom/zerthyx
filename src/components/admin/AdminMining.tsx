import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminMining() {
  const { data: wallets, isLoading } = useQuery({
    queryKey: ["mining-wallets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_wallets")
        .select("user_id, nft_balance")
        .gt("nft_balance", 0)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const totalMiners = wallets?.length || 0;
  const totalNftBalance = (wallets || []).reduce((sum, w) => sum + Number(w.nft_balance || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mining Management</h1>
        <p className="text-muted-foreground">Overview of mining balances and miners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-40"></div>
                <div className="h-6 bg-muted rounded w-56"></div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm">Total miners: <strong>{totalMiners}</strong></div>
                <div className="text-sm">Total mining wallet balance (NFT): <strong>${totalNftBalance.toLocaleString()}</strong></div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Mining Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded"></div>
                ))}
              </div>
            ) : wallets?.length ? (
              <div className="space-y-2">
                {wallets.slice(0, 10).map((w) => (
                  <div key={w.user_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground font-mono">{w.user_id.slice(0,8)}...</div>
                    <div className="text-sm font-medium">${Number(w.nft_balance).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No miners yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
