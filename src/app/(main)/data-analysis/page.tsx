import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ClipboardCheck } from "lucide-react";

const q1_output = {
    user_id: "21wrcxuy-67erfn",
    room_no: "rm-bhf9-aerjn",
};

const q4_output = [
    { status: "Most Ordered", item_name: "Tawa Paratha", quantity: 3 },
    { status: "Least Ordered", item_name: "Unknown Item (itm-w978-23u4)", quantity: 0.5 },
];


export default function DataAnalysisPage() {
    return (
        <div className="flex flex-col h-full p-4 md:p-6 gap-6">
            <header>
                <h1 className="text-2xl font-bold font-headline">DA Assignment - PlatinumRx Output</h1>
                <p className="text-muted-foreground">Query outputs based on the provided PDF data.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Q1: Last Booked Room</CardTitle>
                        <CardDescription>Last booked room for each user.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>user_id</TableHead>
                                    <TableHead>last_booked_room</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-code">{q1_output.user_id}</TableCell>
                                    <TableCell className="font-code">{q1_output.room_no}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Q2: Billing in Nov 2021</CardTitle>
                         <CardDescription>Total billing amount for bookings in November 2021.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No bookings found for November 2021 in the provided data.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Q3: Bills &gt; 1000 in Oct 2021</CardTitle>
                        <CardDescription>Bills raised in October 2021 with an amount over 1000.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">No bills found for October 2021 in the provided data.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Q4: Most & Least Ordered</CardTitle>
                        <CardDescription>For Sept 2021, based on item quantity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead className="text-right">Total Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {q4_output.map(item => (
                                <TableRow key={item.status}>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell className="font-code">{item.item_name}</TableCell>
                                    <TableCell className="text-right font-code">{item.quantity}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <p className="text-xs text-muted-foreground mt-2">Note: The item `itm-w978-23u4` was not fully defined in the provided `items` table.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Q5: 2nd Highest Bill</CardTitle>
                        <CardDescription>For each month of 2021.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Only one customer with one bill was found in the data for September 2021. Therefore, a second highest bill cannot be determined.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
