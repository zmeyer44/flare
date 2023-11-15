"use client";

import { useTheme } from "next-themes";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type LineGraphProps<T> = {
  data: T[];
  primaryKey: keyof T;
};

export function LineGraph<T>({ data, primaryKey }: LineGraphProps<T>) {
  const keys = Object.keys(data[0] ?? { yes: 1, no: 0 });
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <CardDescription>
          How the prices have been changing over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px] text-primary">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          {keys.map((key) => {
                            if (key === primaryKey) {
                              return (
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {key}
                                  </span>
                                  <span className="font-bold text-foreground">
                                    {payload[0]?.value}
                                  </span>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {key}
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[1]?.value}
                                  </span>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {keys.map((k) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  activeDot={{
                    r: k === primaryKey ? 8 : 6,
                    style:
                      k === primaryKey
                        ? { fill: "currentColor" }
                        : { fill: "text-primary", opacity: 0.25 },
                  }}
                  style={
                    k === primaryKey
                      ? ({
                          stroke: "currentColor",
                        } as React.CSSProperties)
                      : ({
                          stroke: "text-primary",
                          opacity: 0.25,
                        } as React.CSSProperties)
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
