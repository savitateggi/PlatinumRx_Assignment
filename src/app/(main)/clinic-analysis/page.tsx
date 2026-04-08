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
        question: "Q1: Find the revenue we got from each sales channel in a given year.",
        query: `-- Assuming '2022' is the given year
SELECT
    sales_channel,
    SUM(amount) AS total_revenue
FROM clinic_sales
WHERE strftime('%Y', sale_date) = '2022'
GROUP BY sales_channel;`
    },
    {
        id: "q2",
        question: "Q2: Find top 10 the most valuable customers for a given year.",
        query: `-- Assuming '2022' is the given year
SELECT
    p.name AS customer_name,
    SUM(cs.amount) AS total_spent
FROM clinic_sales cs
JOIN appointments a ON cs.appointment_id = a.id
JOIN patients p ON a.patient_id = p.id
WHERE strftime('%Y', cs.sale_date) = '2022'
GROUP BY p.id, p.name
ORDER BY total_spent DESC
LIMIT 10;`
    },
    {
        id: "q3",
        question: "Q3: Find month wise revenue, expense, profit, and status (profitable / not-profitable) for a given year.",
        query: `-- Assuming '2022' is the given year
WITH MonthlyRevenue AS (
    SELECT
        strftime('%Y-%m', sale_date) AS month,
        SUM(amount) AS total_revenue
    FROM clinic_sales
    WHERE strftime('%Y', sale_date) = '2022'
    GROUP BY month
),
MonthlyExpenses AS (
    SELECT
        strftime('%Y-%m', expense_date) AS month,
        SUM(amount) AS total_expenses
    FROM expenses
    WHERE strftime('%Y', expense_date) = '2022'
    GROUP BY month
)
SELECT
    m.month,
    COALESCE(m.total_revenue, 0) AS revenue,
    COALESCE(e.total_expenses, 0) AS expense,
    (COALESCE(m.total_revenue, 0) - COALESCE(e.total_expenses, 0)) AS profit,
    CASE
        WHEN (COALESCE(m.total_revenue, 0) - COALESCE(e.total_expenses, 0)) > 0 THEN 'Profitable'
        ELSE 'Not-Profitable'
    END AS status
FROM MonthlyRevenue m
LEFT JOIN MonthlyExpenses e ON m.month = e.month
ORDER BY m.month;`
    },
    {
        id: "q4",
        question: "Q4: For each city, find the most profitable clinic for a given month.",
        query: `-- Assuming '2022-01' is the given month and a 'clinics' table with city info exists.
WITH ClinicProfit AS (
    SELECT
        c.city,
        c.name AS clinic_name,
        SUM(COALESCE(s.amount, 0)) - SUM(COALESCE(e.amount, 0)) AS profit,
        RANK() OVER(PARTITION BY c.city ORDER BY (SUM(COALESCE(s.amount, 0)) - SUM(COALESCE(e.amount, 0))) DESC) as profit_rank
    FROM clinics c
    LEFT JOIN clinic_sales s ON c.id = s.clinic_id AND strftime('%Y-%m', s.sale_date) = '2022-01'
    LEFT JOIN expenses e ON c.id = e.clinic_id AND strftime('%Y-%m', e.expense_date) = '2022-01'
    GROUP BY c.id, c.city, c.name
)
SELECT
    city,
    clinic_name,
    profit
FROM ClinicProfit
WHERE profit_rank = 1;`
    },
    {
        id: "q5",
        question: "Q5: For each state, find the second least profitable clinic for a given month.",
        query: `-- Assuming '2022-01' is the given month and a 'clinics' table with state info exists.
WITH ClinicProfit AS (
    SELECT
        c.state,
        c.name AS clinic_name,
        SUM(COALESCE(s.amount, 0)) - SUM(COALESCE(e.amount, 0)) AS profit,
        DENSE_RANK() OVER(PARTITION BY c.state ORDER BY (SUM(COALESCE(s.amount, 0)) - SUM(COALESCE(e.amount, 0))) ASC) as profit_rank_asc
    FROM clinics c
    LEFT JOIN clinic_sales s ON c.id = s.clinic_id AND strftime('%Y-%m', s.sale_date) = '2022-01'
    LEFT JOIN expenses e ON c.id = e.clinic_id AND strftime('%Y-%m', e.expense_date) = '2022-01'
    GROUP BY c.id, c.state, c.name
)
SELECT
    state,
    clinic_name,
    profit
FROM ClinicProfit
WHERE profit_rank_asc = 2;`
    },
];

export default function ClinicAnalysisPage() {
    return (
        <div className="flex flex-col h-full p-4 md:p-6 gap-6">
            <header>
                <h1 className="text-2xl font-bold font-headline">Clinic System Analysis</h1>
                <p className="text-muted-foreground">Advanced SQL query solutions for clinic system analysis.</p>
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
