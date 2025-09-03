import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardMine() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mining</h1>
        <p className="text-muted-foreground">Mining dashboard</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mining Status</CardTitle>
        </CardHeader>
        <CardContent>
          Mining features coming soon.
        </CardContent>
      </Card>
    </div>
  );
}