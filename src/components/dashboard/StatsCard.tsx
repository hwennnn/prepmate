import { Card, CardContent } from "~/components/ui/card";

interface StatsCardProps {
  value: number | string;
  label: string;
  valueColor: string;
}

export function StatsCard({ value, label, valueColor }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      </CardContent>
    </Card>
  );
}
