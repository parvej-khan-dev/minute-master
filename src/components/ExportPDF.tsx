import React, { useState } from "react";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Todo } from "../types";
import { formatDuration } from "../utils";

interface ExportPDFProps {
  todos: Todo[];
}

export function ExportPDF({ todos }: ExportPDFProps) {
  const [hourlyRate, setHourlyRate] = useState<number>(50);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Task",
      "Duration",
      "Status",
      "Start Time",
      "Stop Time",
    ];
    const tableRows: (string | number)[][] = [];

    let totalSeconds = 0;

    todos.forEach((todo) => {
      tableRows.push([
        todo.text,
        formatDuration(todo.duration),
        todo.completed ? "Completed" : "In Progress",
        todo.startTime ? new Date(todo.startTime).toLocaleString() : "-",
        todo.stopTime ? new Date(todo.stopTime).toLocaleString() : "-",
      ]);
      totalSeconds += todo.duration;
    });

    const totalHours = totalSeconds / 3600;
    const totalCost = (totalHours * hourlyRate).toFixed(2);

    doc.setFontSize(20);
    doc.text("MinuteMaster Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
    doc.text(`Hourly Rate: Rs.${hourlyRate}`, 14, 32);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
      headStyles: { fillColor: [75, 85, 99] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;

    doc.setFontSize(12);
    doc.text(`Total Time: ${formatDuration(totalSeconds)}`, 14, finalY + 10);
    doc.text(`Total Cost: Rs.${totalCost}`, 14, finalY + 20);

    doc.save("time-tracking-report.pdf");
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label htmlFor="hourlyRate" className="text-sm text-gray-600">
          Hourly Rate (Rs.):
        </label>
        <input
          type="number"
          id="hourlyRate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>
      <button
        onClick={generatePDF}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <FileDown className="w-4 h-4" />
        Export PDF
      </button>
    </div>
  );
}
