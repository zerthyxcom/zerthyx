import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminWithdrawals() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Withdrawal Management</h1>
        <p className="text-muted-foreground">Coming soon.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          Withdrawal management will be available soon.
        </CardContent>
      </Card>
    </div>
  );
}