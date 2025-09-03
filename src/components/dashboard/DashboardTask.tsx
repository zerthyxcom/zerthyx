import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardTask() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">Complete tasks to earn rewards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          Task system coming soon.
        </CardContent>
      </Card>
    </div>
  );
}