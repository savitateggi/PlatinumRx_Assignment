"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Database, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const schemas = {
  hotel: {
    name: "Hotel Management",
    tables: [
      { name: "Hotels", columns: "id, name, city, stars" },
      { name: "Bookings", columns: "id, hotel_id, guest_id, check_in, check_out" },
      { name: "Guests", columns: "id, name, email, phone" },
    ],
  },
  clinic: {
    name: "Clinic Management",
    tables: [
      { name: "Patients", columns: "id, name, dob, address" },
      { name: "Appointments", columns: "id, patient_id, doctor_id, appointment_date, reason" },
      { name: "Doctors", columns: "id, name, specialty" },
    ],
  },
};

const mockResults = {
  "SELECT * FROM Hotels": {
    headers: ["id", "name", "city", "stars"],
    rows: [
      ["1", "Grand Hyatt", "New York", "5"],
      ["2", "Mariott", "London", "4"],
      ["3", "Hilton", "Tokyo", "5"],
    ],
  },
    "SELECT * FROM Guests": {
    headers: ["id", "name", "email", "phone"],
    rows: [
      ["1", "John Doe", "john.doe@example.com", "123-456-7890"],
      ["2", "Jane Smith", "jane.smith@example.com", "098-765-4321"],
    ],
  },
};

export default function SqlPracticePage() {
    const [query, setQuery] = useState("SELECT * FROM Hotels");
    const [result, setResult] = useState<{headers: string[], rows: string[][]}>(mockResults["SELECT * FROM Hotels"]);
    const [selectedDb, setSelectedDb] = useState("hotel");

    const handleRunQuery = () => {
        const trimmedQuery = query.trim();
        // @ts-ignore
        setResult(mockResults[trimmedQuery] || { headers: ["Error"], rows: [["Query not recognized or supported in this demo."]] });
    };

    const currentSchema = schemas[selectedDb as keyof typeof schemas];
    
    return (
        <div className="flex flex-col h-[calc(100vh-var(--header-height,0px))] md:h-screen p-4 md:p-6 gap-4">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold font-headline">SQL Practice</h1>
                <div className="flex items-center gap-2">
                    <Select value={selectedDb} onValueChange={setSelectedDb}>
                        <SelectTrigger className="w-[200px]">
                            <Database className="mr-2" />
                            <SelectValue placeholder="Select a database" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hotel">{schemas.hotel.name}</SelectItem>
                            <SelectItem value="clinic">{schemas.clinic.name}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleRunQuery}><Play className="mr-2"/>Run Query</Button>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Schema</CardTitle>
                        <CardDescription>{currentSchema.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full" defaultValue={currentSchema.tables[0].name}>
                            {currentSchema.tables.map(table => (
                                <AccordionItem value={table.name} key={table.name}>
                                    <AccordionTrigger>{table.name}</AccordionTrigger>
                                    <AccordionContent className="font-code text-xs text-muted-foreground p-2 bg-muted rounded-md">
                                        {table.columns}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
                <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardHeader>
                           <CardTitle>SQL Editor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex">
                            <Textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="font-code h-full flex-1 resize-none"
                                placeholder="-- Write your SQL query here. Try 'SELECT * FROM Guests'"
                            />
                        </CardContent>
                    </Card>
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto">
                            <ScrollArea className="h-full">
                               <Table>
                                   <TableHeader className="sticky top-0 bg-card">
                                       <TableRow>
                                           {result.headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                                       </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                       {result.rows.map((row, i) => (
                                           <TableRow key={i}>
                                               {row.map((cell, j) => <TableCell key={j} className="font-code">{cell}</TableCell>)}
                                           </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
