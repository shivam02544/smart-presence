"use client";

import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Lock } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { saveOfflineAttendance, getOfflineRecords, clearSyncedRecords } from "@/lib/offline";
import { useToast } from "@/providers/toast-provider";

export default function MarkAttendancePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [deviceId, setDeviceId] = useState("");

  // Generate persistent device ID
  useEffect(() => {
    let storedId = localStorage.getItem("sp_device_id");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("sp_device_id", storedId);
    }
    setDeviceId(storedId);
  }, []);

  // Background Auto Sync (runs when internet returns)
  useEffect(() => {
    const syncOfflineEntries = async () => {
      const pending = await getOfflineRecords();
      if (!pending.length) return;

      let syncedIds = [];

      for (const entry of pending) {
        const res = await fetch("/api/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });

        if (res.ok) {
          syncedIds.push(entry.id);
        }
      }

      if (syncedIds.length) {
        await clearSyncedRecords(syncedIds);
        showToast(`✔ Synced ${syncedIds.length} offline record(s)!`, "success");
      }
    };

    window.addEventListener("online", syncOfflineEntries);

    return () => window.removeEventListener("online", syncOfflineEntries);
  }, []);

  // Handle Attendance Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { sessionCode, deviceId, time: Date.now() };

    try {
      // 🚨 If offline → store locally, notify + stop network request
      if (!navigator.onLine) {
        await saveOfflineAttendance(payload);
        showToast(
          "⚠ You are offline — attendance stored and will sync when you're back online.",
          "warning"
        );
        setLoading(false);
        return;
      }

      // Send live update to teacher UI
      const socket = io("http://localhost:3001");
      socket.emit("attendanceMarked", payload);

      // Send to backend
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("✔ Attendance marked successfully!", "success");

      // Redirect after confirmation
      setTimeout(() => router.push("/student/dashboard"), 1800);

    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-10 animate-fade space-y-8">

      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold">Mark Attendance</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Scan QR or enter the session code manually
        </p>
      </header>

      {/* Scanner placeholder */}
      <div className="rounded-2xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#111113] shadow-md p-8">
        <div className="w-full aspect-[1/1] rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <QrCode size={90} className="text-gray-600 dark:text-gray-300" />
        </div>
        <p className="text-xs text-center text-gray-500 mt-3">
          QR scanning coming soon — enter code below for now.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Session Code"
          placeholder="Enter session code"
          required
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          icon={<Lock size={18} />}
        />

        <Button type="submit" variant="gradient" size="lg" fullWidth isLoading={loading}>
          Mark Attendance
        </Button>
      </form>

      <div className="text-center text-xs text-gray-500 mt-4">
        Attendance is verified with your device & IP for security.
      </div>
    </div>
  );
}
