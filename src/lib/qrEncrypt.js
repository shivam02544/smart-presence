import crypto from "crypto";

const SECRET_KEY = process.env.QR_SECRET || "SMARTPRESENCE_QR_KEY_2025";

export function generateQRPayload(sessionId) {
  const expiry = Date.now() + 1000 * 15; // QR valid for 15 seconds

  const rawData = `${sessionId}|${expiry}`;
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(rawData).digest("hex");

  return Buffer.from(JSON.stringify({ sessionId, expiry, signature })).toString("base64");
}

export function verifyQRPayload(encoded) {
  try {
    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
    const { sessionId, expiry, signature } = decoded;

    if (Date.now() > expiry) return { valid: false, reason: "QR expired" };

    const rawData = `${sessionId}|${expiry}`;
    const expectedSig = crypto.createHmac("sha256", SECRET_KEY).update(rawData).digest("hex");

    return {
      valid: signature === expectedSig,
      sessionId,
    };

  } catch {
    return { valid: false, reason: "Invalid format" };
  }
}
