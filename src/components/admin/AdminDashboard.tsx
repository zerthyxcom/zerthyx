import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, DollarSign } from "lucide-react";

export function AdminDashboard() {
  const stats = {
    total_deposits: 0,
    active_users: 0,
    total_nft_locked: 0,
    today_profit: 0,
  };

  const statCards = [
    {
      title: "Total Deposits",
      value: `$${stats?.total_deposits?.toLocaleString() || "0"}`,
      description: "Total USDT deposited",
      icon: DollarSign,
      trend: "+12.5%",
    },
    {
      title: "Active Users",
      value: stats?.active_users?.toLocaleString() || "0",
      description: "Users active in last 30 days",
      icon: Users,
      trend: "+8.2%",
    },
    {
      title: "Total NFT Locked",
      value: `$${stats?.total_nft_locked?.toLocaleString() || "0"}`,
      description: "USDT locked in staking",
      icon: Wallet,
      trend: "+15.3%",
    },
    {
      title: "Today's Profit",
      value: `$${stats?.today_profit?.toLocaleString() || "0"}`,
      description: "Profit distributed today",
      icon: TrendingUp,
      trend: "+5.7%",
    },
  ];

  const [activities, setActivities] = useState<Array<{ id: string; type: 'deposit' | 'withdrawal'; message: string; created_at: string }>>([]);

  useEffect(() => {
    let isMounted = true;
    const loadInitial = async () => {
      try {
        const [{ data: deps }, { data: withds }] = await Promise.all([
          supabase.from('deposits').select('id, amount, status, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('withdrawals').select('id, amount, status, created_at').order('created_at', { ascending: false }).limit(5),
        ]);
        const items = [
          ...(deps || []).map(d => ({ id: d.id, type: 'deposit' as const, message: `Deposit ${d.status}: $${Number(d.amount).toLocaleString()}`, created_at: d.created_at })),
          ...(withds || []).map(w => ({ id: w.id, type: 'withdrawal' as const, message: `Withdrawal ${w.status}: $${Number(w.amount).toLocaleString()}`, created_at: w.created_at })),
        ]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        if (isMounted) setActivities(items);
      } catch (e) {
        console.error('Failed to load recent activity', e);
      }
    };

    const channel = supabase
      .channel('admin-activity')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits' }, (payload) => {
        const r: any = payload.new || payload.old;
        const item = { id: r.id, type: 'deposit' as const, message: `Deposit ${r.status}: $${Number(r.amount).toLocaleString()}`, created_at: r.created_at };
        setActivities(prev => [item, ...prev].sort((a,b)=> new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,5));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, (payload) => {
        const r: any = payload.new || payload.old;
        const item = { id: r.id, type: 'withdrawal' as const, message: `Withdrawal ${r.status}: $${Number(r.amount).toLocaleString()}`, created_at: r.created_at };
        setActivities(prev => [item, ...prev].sort((a,b)=> new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).slice(0,5));
      })
      .subscribe();

    loadInitial();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your crypto staking platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-green-600">{stat.trend}</span>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No recent activity</div>
              ) : (
                activities.map((a) => (
                  <div key={`${a.type}-${a.id}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{a.message}</p>
                      <p className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                    <span className="text-green-600 text-sm">{a.type === 'deposit' ? '+ Deposit' : 'Withdrawal'}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Blockchain Networks</span>
                <span className="text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database</span>
                <span className="text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>API Services</span>
                <span className="text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Running
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}