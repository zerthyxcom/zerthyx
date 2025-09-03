import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Wallet, DollarSign, ArrowUpRight } from "lucide-react";

interface WalletData {
  main_balance: number;
  nft_balance: number;
  total_deposited: number;
  total_withdrawn: number;
}

interface DepositData {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

interface WithdrawalData {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

export function DashboardHome() {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData>({
    main_balance: 0,
    nft_balance: 0,
    total_deposited: 0,
    total_withdrawn: 0
  });
  const [deposits, setDeposits] = useState<DepositData[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load wallet
      const { data: walletData } = await supabase
        .from("user_wallets")
        .select("main_balance, nft_balance, total_deposited, total_withdrawn")
        .eq("user_id", user.id)
        .maybeSingle();

      if (walletData) {
        setWallet({
          main_balance: Number(walletData.main_balance || 0),
          nft_balance: Number(walletData.nft_balance || 0),
          total_deposited: Number(walletData.total_deposited || 0),
          total_withdrawn: Number(walletData.total_withdrawn || 0),
        });
      }

      // Load recent deposits
      const { data: depositsData } = await supabase
        .from("deposits")
        .select("id, amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (depositsData) {
        setDeposits(depositsData);
      }

      // Load recent withdrawals
      const { data: withdrawalsData } = await supabase
        .from("withdrawals")
        .select("id, amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (withdrawalsData) {
        setWithdrawals(withdrawalsData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Zerthyx dashboard</p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.main_balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFT Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.nft_balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Staked in NFTs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.total_deposited.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime deposits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wallet.total_withdrawn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Lifetime withdrawals</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            {deposits.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No deposits yet</p>
            ) : (
              <div className="space-y-3">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">${Number(deposit.amount).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(deposit.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={deposit.status === "approved" ? "default" : deposit.status === "pending" ? "secondary" : "destructive"}>
                      {deposit.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No withdrawals yet</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">${Number(withdrawal.amount).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={withdrawal.status === "approved" ? "default" : withdrawal.status === "pending" ? "secondary" : "destructive"}>
                      {withdrawal.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}