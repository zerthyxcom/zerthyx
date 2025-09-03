import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardMe() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          Profile management coming soon.
        </CardContent>
      </Card>
    </div>
  );
}