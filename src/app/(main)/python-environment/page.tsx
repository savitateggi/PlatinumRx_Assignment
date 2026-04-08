"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Play, FileCode, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const examples = {
  string_manipulation: {
    title: "String Manipulation",
    description: "Reverse a string.",
    code: 'my_string = "Hello, World!"\nprint(my_string[::-1])',
    output: '!dlroW ,olleH',
  },
  data_conversion: {
    title: "Data Conversion (CSV to JSON)",
    description: "Convert a simple CSV string to a JSON-like format.",
    code: `import json

csv_data = """name,age,city
Alice,30,New York
Bob,25,Los Angeles"""

lines = csv_data.strip().split('\\n')
headers = lines[0].split(',')
result = []
for line in lines[1:]:
    values = line.split(',')
    result.append(dict(zip(headers, values)))

print(json.dumps(result, indent=2))`,
    output: `[
  {
    "name": "Alice",
    "age": "30",
    "city": "New York"
  },
  {
    "name": "Bob",
    "age": "25",
    "city": "Los Angeles"
  }
]`,
  },
};

export default function PythonEnvironmentPage() {
    const [script, setScript] = useState(examples.string_manipulation.code);
    const [output, setOutput] = useState("");

    const handleRunScript = () => {
        // Simple mock execution
        if (script.trim() === examples.string_manipulation.code.trim()) {
            setOutput(examples.string_manipulation.output);
        } else if (script.trim() === examples.data_conversion.code.trim()) {
            setOutput(examples.data_conversion.output);
        } else {
            setOutput("Output for this custom script is not supported in this demo.\nTry one of the examples.");
        }
    };
    
    const loadExample = (exampleKey: keyof typeof examples) => {
        setScript(examples[exampleKey].code);
        setOutput("");
    }

    return (
        <div className="flex flex-col h-[calc(100vh-var(--header-height,0px))] md:h-screen p-4 md:p-6 gap-4">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-headline">Python Environment</h1>
                    <p className="text-muted-foreground">Write and test Python scripts for data tasks.</p>
                </div>
                <Button onClick={handleRunScript}><Play className="mr-2"/>Run Script</Button>
            </header>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb /> Examples</CardTitle>
                        <CardDescription>Click to load an example script.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" onClick={() => loadExample('string_manipulation')}>String Manipulation</Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => loadExample('data_conversion')}>Data Conversion</Button>
                    </CardContent>
                </Card>
                <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2"><FileCode /> Python Editor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex">
                            <Textarea
                                value={script}
                                onChange={(e) => setScript(e.target.value)}
                                className="font-code h-full flex-1 resize-none"
                                placeholder="# Write your Python script here"
                            />
                        </CardContent>
                    </Card>
                    <Card className="flex-1 flex flex-col min-h-0">
                        <CardHeader>
                            <CardTitle>Console Output</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ScrollArea className="h-full w-full rounded-md border bg-muted">
                                <pre className="font-code text-sm p-4 h-full w-full">{output || "// Output will be shown here..."}</pre>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
