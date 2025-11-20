"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/components/composite/Table";
import EmptyState from "@/components/composite/EmptyState";
import { BarChart3, CalendarRange, Download } from "lucide-react";

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    if (!startDate || !endDate) return alert("Select both dates first.");

    setLoading(true);

    try {
      const res = await fetch(`/api/reports?start=${startDate}&end=${endDate}`);
      const data = await res.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        alert(data.error || "Failed to fetch report.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }

    setLoading(false);
  };

  const handleExport = () => {
    if (!reportData.length) return alert("No data available.");

    const formatted = reportData.map((row) => ({
      Roll: row.roll,
      Name: row.name,
      Course: row.course,
      Status: row.status,
      Time: row.time,
      IP: row.ip,
      Device: row.device,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, `attendance_report_${startDate}_to_${endDate}.xlsx`);
  };

  const columns = [
    { header: "Roll", accessor: "roll" },
    { header: "Name", accessor: "name" },
    { header: "Course", accessor: "course" },
    { header: "Status", accessor: "status" },
    { header: "Time", accessor: "time" },
    { header: "IP", accessor: "ip" },
    { header: "Device", accessor: "device" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-10 animate-fade">

      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate detailed attendance reports with export support.
          </p>
        </div>
      </header>

      {/* Filters */}
      <Card padding="lg" className="space-y-5">

        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CalendarRange size={18} className="text-purple-500" />
          Date Range
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#111113] border border-gray-300 dark:border-gray-700"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-md bg-white dark:bg-[#111113] border border-gray-300 dark:border-gray-700"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="gradient"
              fullWidth
              size="lg"
              onClick={handleFilter}
              disabled={!startDate || !endDate || loading}
            >
              {loading ? "Loading..." : "Generate Report"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Display */}
      {reportData.length ? (
        <>
          <Card padding="lg" className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="text-purple-500" size={20} />
              Report Results ({reportData.length} entries)
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExport}
            >
              <Download size={16} /> Export Excel
            </Button>
          </Card>

          <Card padding="lg">
            <Table data={reportData} columns={columns} responsive="scroll" />
          </Card>
        </>
      ) : (
        <Card padding="lg">
          <EmptyState
            icon={<BarChart3 size={26} />}
            heading="No report generated yet"
            description="Select a date range and click 'Generate Report'."
          />
        </Card>
      )}
    </div>
  );
}
