import { Server } from "socket.io";

let io;

export function GET() {
  if (!io) {
    io = new Server(3001, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    console.log("🔥 WebSocket server running on port 3001");

    io.on("connection", (socket) => {
      console.log("🟢 Client connected:", socket.id);

      socket.on("joinSession", (sessionId) => {
        socket.join(sessionId);
        console.log(`👤 User joined session: ${sessionId}`);
      });

      socket.on("attendanceMarked", (data) => {
        console.log("📢 Broadcasting new attendance:", data);
        io.to(data.sessionId).emit("newAttendance", data);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });
  }

  return new Response("WebSocket server active", { status: 200 });
}
