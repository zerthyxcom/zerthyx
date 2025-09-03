import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminProfits() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profit Management</h1>
        <p className="text-muted-foreground">Coming soon.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          Profit tracking and transfers will be added soon.
        </CardContent>
      </Card>
    </div>
  );
}
