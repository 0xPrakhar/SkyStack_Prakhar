import { useState, useRef, useEffect } from "react";
import { QrCode, AlertCircle, CheckCircle, X } from "lucide-react";
import API from "../api";

export default function QRScanner({ onClose }) {
  const [scannedCode, setScannedCode] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (e) => {
    const code = e.target.value;
    setScannedCode(code);

    if (code.length > 5) {
      await verifyTicket(code);
      setScannedCode("");
      inputRef.current?.focus();
    }
  };

  const verifyTicket = async (ticketId) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/checkin/verify/${ticketId}`, {
        method: "POST",
        headers: {
          "Authorization": token
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid ticket");
        setScanResult({ success: false, msg: data.msg });
        return;
      }

      setScanResult({ success: true, ...data });
      setSuccessCount(prev => prev + 1);

      // Auto-clear after 2 seconds
      setTimeout(() => setScanResult(null), 2000);
    } catch (err) {
      console.error("Scan error:", err);
      setError("Failed to verify ticket");
      setScanResult({ success: false, msg: "Verification failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <QrCode size={24} className="text-blue-600" />
            QR Scanner
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Counter */}
        <div className="bg-linear-to-r from-mint-400 to-blue-500 text-white rounded-lg p-4 text-center">
          <p className="text-sm font-semibold">Check-ins Today</p>
          <p className="text-3xl font-bold">{successCount}</p>
        </div>

        {/* Scanner Input (hidden but focused) */}
        <input
          ref={inputRef}
          type="text"
          value={scannedCode}
          onChange={handleScan}
          placeholder="Place scanner focus here..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">Error</p>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {scanResult?.success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              <div>
                <p className="font-bold text-green-800 dark:text-green-300">Check-in Successful!</p>
                <p className="text-sm text-green-700 dark:text-green-400">{scanResult.ticket.userName}</p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {new Date(scanResult.ticket.checkInTime).toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Failed Message */}
        {scanResult?.success === false && !error && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-300">Issue</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">{scanResult.msg}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
          <h3 className="font-bold text-blue-900 dark:text-blue-300">How to use:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>✓ Point camera at QR code</li>
            <li>✓ Auto-scan and verify</li>
            <li>✓ Green = Check-in successful</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
