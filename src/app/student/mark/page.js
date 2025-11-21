"use client";

import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Lock } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import dynamic from 'next/dynamic';

import { Html5QrcodeScanner } from "html5-qrcode";

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

  // Initialize QR Scanner only after deviceId is available
  useEffect(() => {
    if (!deviceId) return; // Wait for deviceId to be set

    let scanner = null;

    try {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          handleScan(decodedText);
          scanner?.clear().catch(() => { }); // Safely clear
        },
        (error) => {
          // Ignore scanning errors
        }
      );
    } catch (error) {
      console.error("Failed to initialize scanner:", error);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => { }); // Safely clear on unmount
      }
    };
  }, [deviceId]); // Only initialize when deviceId is available

  const handleScan = (decodedText) => {
    if (decodedText) {
      handleAttendanceSubmit({ preventDefault: () => { } }, decodedText);
    }
  };

  const handleAttendanceSubmit = async (e, directPayload = null) => {
    if (e) e.preventDefault();
    setLoading(true);

    let payloadData = {};

    if (directPayload) {
      payloadData = { qrPayload: directPayload, deviceId, time: Date.now() };
    } else {
      payloadData = { sessionCode, deviceId, time: Date.now() };
    }

    try {
      if (!navigator.onLine) {
        await saveOfflineAttendance(payloadData);
        showToast(
          "⚠ You are offline — attendance stored and will sync when you're back online.",
          "warning"
        );
        setLoading(false);
        return;
      }

      // const socket = io();
      // socket.emit("markAttendance", { ...payloadData, sessionId: "unknown" });

      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Emit socket event with returned record
      if (data.record) {
        const socket = io();
        socket.emit("markAttendance", data.record);
      }

      showToast("✔ Attendance marked successfully!", "success");

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
      {/* Scanner */}
      <div className="rounded-2xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#111113] shadow-md p-4 overflow-hidden">
        <div id="reader" className="w-full rounded-xl overflow-hidden"></div>
        <p className="text-xs text-center text-gray-500 mt-3">
          Point camera at the teacher's QR code
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleAttendanceSubmit} className="space-y-5">
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
