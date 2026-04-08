import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileQuestion } from "lucide-react";

const hotelQueries = [
    {
        id: "q1",
        question: "Q1: Which was the last room booked?",
        query: `SELECT room_id, booking_date
FROM bookings
ORDER BY booking_date DESC
LIMIT 1;`
    },
    {
        id: "q2",
        question: "Q2: What was the total billing for November 2021?",
        query: `SELECT
    b.booking_id,
    SUM(bc.quantity * i.rate) AS total_bill
FROM bookings b
JOIN booking_commercials bc ON b.booking_id = bc.booking_id
JOIN items i ON bc.item_id = i.item_id
WHERE b.booking_date >= '2021-11-01' AND b.booking_date < '2021-12-01'
GROUP BY b.booking_id;`
    },
    {
        id: "q3",
        question: "Q3: Find all bills greater than 1000.",
        query: `SELECT
    b.booking_id,
    SUM(bc.quantity * i.rate) AS total_bill
FROM bookings b
JOIN booking_commercials bc ON b.booking_id = bc.booking_id
JOIN items i ON bc.item_id = i.item_id
GROUP BY b.booking_id
HAVING SUM(bc.quantity * i.rate) > 1000;`
    },
    {
        id: "q4",
        question: "Q4: What were the most and least ordered items each month?",
        query: `WITH MonthlyOrders AS (
    SELECT
        strftime('%Y-%m', b.booking_date) AS month,
        i.item_name,
        COUNT(i.item_id) AS order_count,
        RANK() OVER (PARTITION BY strftime('%Y-%m', b.booking_date) ORDER BY COUNT(i.item_id) DESC) as rank_most,
        RANK() OVER (PARTITION BY strftime('%Y-%m', b.booking_date) ORDER BY COUNT(i.item_id) ASC) as rank_least
    FROM bookings b
    JOIN booking_commercials bc ON b.booking_id = bc.booking_id
    JOIN items i ON bc.item_id = i.item_id
    GROUP BY month, i.item_name
)
SELECT
    month,
    item_name,
    order_count,
    'Most Ordered' as status
FROM MonthlyOrders
WHERE rank_most = 1
UNION ALL
SELECT
    month,
    item_name,
    order_count,
    'Least Ordered' as status
FROM MonthlyOrders
WHERE rank_least = 1;`
    },
    {
        id: "q5",
        question: "Q5: Find the 2nd highest bill.",
        query: `WITH RankedBills AS (
    SELECT
        b.booking_id,
        SUM(bc.quantity * i.rate) AS total_bill,
        DENSE_RANK() OVER (ORDER BY SUM(bc.quantity * i.rate) DESC) as bill_rank
    FROM bookings b
    JOIN booking_commercials bc ON b.booking_id = bc.booking_id
    JOIN items i ON bc.item_id = i.item_id
    GROUP BY b.booking_id
)
SELECT
    booking_id,
    total_bill
FROM RankedBills
WHERE bill_rank = 2;`
    },
];

export default function HotelAnalysisPage() {
    return (
        <div className="flex flex-col h-full p-4 md:p-6 gap-6">
            <header>
                <h1 className="text-2xl font-bold font-headline">Hotel System Analysis</h1>
                <p className="text-muted-foreground">SQL query solutions for Part A (Questions 1-5).</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileQuestion /> Questions & Queries</CardTitle>
                    <CardDescription>
                        Click on a question to view the suggested SQL query solution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="q1">
                        {hotelQueries.map(item => (
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
