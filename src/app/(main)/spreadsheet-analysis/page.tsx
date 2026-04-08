"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";


const salesData = [
  { month: "Jan", revenue: 4500, expenses: 2200 },
  { month: "Feb", revenue: 4800, expenses: 2300 },
  { month: "Mar", revenue: 5200, expenses: 2500 },
  { month: "Apr", revenue: 5500, expenses: 2600 },
  { month: "May", revenue: 6000, expenses: 2800 },
  { month: "Jun", revenue: 6300, expenses: 3000 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
};

export default function SpreadsheetAnalysisPage() {
    const [lookupValue, setLookupValue] = useState("");
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const handleCalculate = () => {
        if (lookupValue) {
            const monthData = salesData.find(d => d.month.toLowerCase() === lookupValue.toLowerCase());
            if (monthData) {
                const profit = monthData.revenue - monthData.expenses;
                setAnalysisResult(`Profit for ${monthData.month}: $${profit.toLocaleString()}`);
            } else {
                setAnalysisResult("Month not found.");
            }
        } else {
            const totalRevenue = salesData.reduce((acc, d) => acc + d.revenue, 0);
            setAnalysisResult(`Total revenue for 6 months: $${totalRevenue.toLocaleString()}`);
        }
    };

    return (
        <div className="flex flex-col h-full p-4 md:p-6 gap-6">
            <header>
                <h1 className="text-2xl font-bold font-headline">Spreadsheet Analysis</h1>
                <p className="text-muted-foreground">Perform lookups and time-based analysis on sample sales data.</p>
            </header>
            
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                        <CardDescription>Configure your analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="lookup">Lookup Month (e.g., Jan)</Label>
                           <Input id="lookup" value={lookupValue} onChange={e => setLookupValue(e.target.value)} placeholder="e.g. Mar" />
                        </div>
                        <Button onClick={handleCalculate} className="w-full"><Calculator className="mr-2" /> Calculate</Button>
                        {analysisResult && (
                            <Card className="bg-accent text-accent-foreground mt-4">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base text-accent-foreground">Result</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="font-semibold text-accent-foreground">{analysisResult}</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Source Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">Expenses</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salesData.map(d => (
                                    <TableRow key={d.month}>
                                        <TableCell className="font-medium">{d.month}</TableCell>
                                        <TableCell className="text-right font-code">${d.revenue.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-code">${d.expenses.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Data Visualization</CardTitle>
                    <CardDescription>Monthly Revenue & Expenses</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <RechartsBarChart data={salesData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value)/1000}k`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
