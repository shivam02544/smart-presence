"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";
import * as XLSX from "xlsx";

import { generateQRPayload } from "@/lib/qrEncrypt";

import {
  Users,
  Clock,
  Activity,
  LayoutDashboard,
  Download,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const PAGE_SIZE = 10;

export default function TeacherSessionPage({ params }) {
  const sessionId = params?.id;

  const [viewMode, setViewMode] = useState("simple"); // simple | advanced
  const [qrValue, setQrValue] = useState("");
  const [records, setRecords] = useState([]);
  const [highlightRecordId, setHighlightRecordId] = useState(null);
  const [presentCount, setPresentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  // -----------------------------
  // 🔹 Generate rotating encrypted QR
  // -----------------------------
  useEffect(() => {
    const updateQR = () => {
      setQrValue(generateQRPayload(sessionId));
    };

    updateQR();
    const interval = setInterval(updateQR, 15000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // -----------------------------
  // 🔹 Real-time WebSocket listener
  // -----------------------------
  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.emit("joinSession", sessionId);

    socket.on("newAttendance", (entry) => {
      setRecords((prev) => {
        const updated = [entry, ...prev];
        setHighlightRecordId(entry.roll);
        return updated;
      });
    });

    return () => socket.disconnect();
  }, [sessionId]);

  // -----------------------------
  // 🔹 Sync attendance with backend (optional if using WebSockets only)
  // -----------------------------
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(`/api/attendance/session/${sessionId}`);
        const data = await res.json();

        if (data.success) {
          setRecords(data.records);
        }
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };

    fetchRecords();
  }, [sessionId]);

  // -----------------------------
  // 🔹 Timer Countdown
  // -----------------------------
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, []);

  // -----------------------------
  // 🔹 Counter Sync
  // -----------------------------
  useEffect(() => {
    setPresentCount(records.length);
  }, [records]);

  const totalPages = Math.ceil(records.length / PAGE_SIZE) || 1;

  const pagedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return records.slice(start, start + PAGE_SIZE);
  }, [records, currentPage]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // -----------------------------
  // 🔹 Export Attendance to Excel
  // -----------------------------
  const handleExport = () => {
    if (!records.length) return alert("No attendance to export.");

    const rows = records.map((r) => ({
      Roll: r.roll,
      Name: r.name,
      "Join Time": r.joinTime,
      "Leave Time": r.leaveTime || "-",
      Device: r.device,
      Browser: r.browser,
      IP: r.ip,
      Status: r.status,
      Flags: r.flags?.length ? r.flags.join(", ") : "-",
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Attendance");
    XLSX.writeFile(book, `Session_${sessionId}.xlsx`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-fade">
      {/* ---------------- HEADER ---------------- */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Live Attendance
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Session: <span className="font-mono">{sessionId}</span>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setViewMode((prev) => (prev === "simple" ? "advanced" : "simple"))
          }
          className="flex items-center gap-2"
        >
          {viewMode === "simple" ? (
            <>
              <Activity size={16} /> Advanced View
            </>
          ) : (
            <>
              <LayoutDashboard size={16} /> Simple View
            </>
          )}
        </Button>
      </header>

      {/* ---------------- SIMPLE VIEW ---------------- */}
      {viewMode === "simple" && (
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* QR + Timer */}
            <Card padding="lg" className="space-y-5 text-center">
              <p className="text-sm font-medium">Scan QR to Mark Attendance</p>

              <div className="mx-auto w-48 h-48 p-2 rounded-xl bg-white dark:bg-black border">
                {qrValue && <QRCode value={qrValue} size={180} />}
              </div>

              <p className="text-xs text-gray-500">
                QR expires every <b>15 seconds</b>
              </p>
            </Card>

            {/* Timer + Count */}
            <Card padding="lg" className="space-y-4">
              <div className="p-4 rounded-xl border">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock size={14} /> Time Remaining
                </p>
                <p className="text-3xl font-semibold text-purple-500">
                  {formatTime(timeLeft)}
                </p>
              </div>

              <div className="p-4 rounded-xl border">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Users size={14} /> Students Present
                </p>
                <p className="text-3xl font-semibold">{presentCount}</p>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 md:flex-row">
            <Button variant="gradient" size="lg" className="flex-1">
              Close Session
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setTimeLeft((prev) => prev + 300)}
            >
              + Extend 5 min
            </Button>
          </div>
        </section>
      )}

      {/* ---------------- ADVANCED VIEW ---------------- */}
      {viewMode === "advanced" && (
        <section className="space-y-6">
          <Card padding="lg" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Activity size={18} className="text-purple-500" /> Attendance
                Records
              </h2>

              <Button onClick={handleExport} size="sm" variant="outline">
                <Download size={14} /> Export Excel
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-900 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Roll</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Device</th>
                    <th className="py-3 px-4">Browser</th>
                    <th className="py-3 px-4">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pagedRecords.map((row, i) => (
                    <tr
                      key={i}
                      className={`hover:bg-gray-50 ${
                        highlightRecordId === row.roll ? "animate-entry" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{row.roll}</td>
                      <td className="px-4 py-3">{row.name}</td>
                      <td className="px-4 py-3">{row.status}</td>
                      <td className="px-4 py-3">{row.device}</td>
                      <td className="px-4 py-3">{row.browser}</td>
                      <td className="px-4 py-3">{row.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between text-xs">
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
