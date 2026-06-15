"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScanHistoryPoint } from "@/lib/scans/queries";

interface ScanHistoryChartProps {
  data: ScanHistoryPoint[];
}

export function ScanHistoryChart({ data }: ScanHistoryChartProps) {
  if (data.length < 2) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Evolução dos scans</CardTitle>
        <CardDescription>Dispositivos, portas abertas e riscos ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelFormatter={(_, payload) => {
                  const point = payload?.[0]?.payload as ScanHistoryPoint | undefined;
                  if (!point) return "";
                  return new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(point.startedAt));
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="deviceCount"
                name="Dispositivos"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="openPortCount"
                name="Portas"
                stroke="var(--info)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="riskCount"
                name="Riscos"
                stroke="var(--danger)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
