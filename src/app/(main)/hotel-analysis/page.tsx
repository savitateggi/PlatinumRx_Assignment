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
        question: "Q1: For every user in the system, get the user_id and last booked room_no.",
        query: `WITH LastBooking AS (
    SELECT
        guest_id,
        room_id,
        -- Use ROW_NUMBER to find the latest booking for each guest
        ROW_NUMBER() OVER(PARTITION BY guest_id ORDER BY booking_date DESC) as rn
    FROM bookings
)
SELECT guest_id, room_id
FROM LastBooking
WHERE rn = 1;`
    },
    {
        id: "q2",
        question: "Q2: Get booking_id and total billing amount of every booking created in November, 2021.",
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
        question: "Q3: Get bill_id and bill amount of all the bills raised in October, 2021 having bill amount > 1000.",
        query: `SELECT
    b.booking_id,
    SUM(bc.quantity * i.rate) AS total_bill
FROM bookings b
JOIN booking_commercials bc ON b.booking_id = bc.booking_id
JOIN items i ON bc.item_id = i.item_id
WHERE strftime('%Y-%m', b.booking_date) = '2021-10'
GROUP BY b.booking_id
HAVING SUM(bc.quantity * i.rate) > 1000;`
    },
    {
        id: "q4",
        question: "Q4: Determine the most ordered and least ordered item of each month of year 2021.",
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
    WHERE strftime('%Y', b.booking_date) = '2021'
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
WHERE rank_least = 1
ORDER BY month, status;`
    },
    {
        id: "q5",
        question: "Q5: Find the customers with the second highest bill value of each month of year 2021.",
        query: `WITH MonthlyBills AS (
    SELECT
        strftime('%Y-%m', b.booking_date) AS month,
        g.name as guest_name,
        b.guest_id,
        SUM(bc.quantity * i.rate) AS total_bill
    FROM bookings b
    JOIN guests g ON b.guest_id = g.id
    JOIN booking_commercials bc ON b.booking_id = bc.booking_id
    JOIN items i ON bc.item_id = i.item_id
    WHERE strftime('%Y', b.booking_date) = '2021'
    GROUP BY month, b.guest_id, g.name
),
RankedBills AS (
    SELECT
        month,
        guest_name,
        guest_id,
        total_bill,
        DENSE_RANK() OVER (PARTITION BY month ORDER BY total_bill DESC) as bill_rank
    FROM MonthlyBills
)
SELECT
    month,
    guest_name,
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
                <p className="text-muted-foreground">SQL query solutions for common hotel system queries.</p>
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
