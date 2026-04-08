import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HeartPulse } from "lucide-react";

const clinicQueries = [
    {
        id: "q1",
        question: "Q1: What is the total revenue generated from each sales channel?",
        query: `SELECT
    sales_channel,
    SUM(amount) AS total_revenue
FROM clinic_sales
GROUP BY sales_channel;`
    },
    {
        id: "q2",
        question: "Q2: Which doctor had the most appointments in January 2022?",
        query: `SELECT
    d.name,
    COUNT(a.id) AS appointment_count
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
WHERE strftime('%Y-%m', a.appointment_date) = '2022-01'
GROUP BY d.name
ORDER BY appointment_count DESC
LIMIT 1;`
    },
    {
        id: "q3",
        question: "Q3: Calculate the monthly profit/loss.",
        query: `WITH MonthlyRevenue AS (
    SELECT
        strftime('%Y-%m', sale_date) AS month,
        SUM(amount) AS total_revenue
    FROM clinic_sales
    GROUP BY month
),
MonthlyExpenses AS (
    SELECT
        strftime('%Y-%m', expense_date) AS month,
        SUM(amount) AS total_expenses
    FROM expenses
    GROUP BY month
)
SELECT
    mr.month,
    mr.total_revenue,
    me.total_expenses,
    (mr.total_revenue - me.total_expenses) AS profit_loss
FROM MonthlyRevenue mr
JOIN MonthlyExpenses me ON mr.month = me.month
ORDER BY mr.month;`
    },
    {
        id: "q4",
        question: "Q4: Who are the top 5 patients with the highest spending?",
        query: `SELECT
    p.name,
    SUM(cs.amount) as total_spent
FROM clinic_sales cs
JOIN appointments a ON cs.appointment_id = a.id
JOIN patients p ON a.patient_id = p.id
GROUP BY p.name
ORDER BY total_spent DESC
LIMIT 5;`
    },
    {
        id: "q5",
        question: "Q5: What is the most common appointment reason?",
        query: `SELECT
    reason,
    COUNT(*) AS frequency
FROM appointments
GROUP BY reason
ORDER BY frequency DESC
LIMIT 1;`
    },
];

export default function ClinicAnalysisPage() {
    return (
        <div className="flex flex-col h-full p-4 md:p-6 gap-6">
            <header>
                <h1 className="text-2xl font-bold font-headline">Clinic System Analysis</h1>
                <p className="text-muted-foreground">SQL query solutions for Part B (Questions 1-5).</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HeartPulse /> Questions & Queries</CardTitle>
                    <CardDescription>
                        Click on a question to view the suggested SQL query solution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="q1">
                        {clinicQueries.map(item => (
                            <AccordionItem value={item.id} key={item.id}>
                                <AccordionTrigger>{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <ScrollArea className="h-auto max-h-72 w-full rounded-md border bg-muted">
                                        <pre className="font-code text-sm p-4 w-full">{item.query}</pre>
                                    </ScrollArea>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
