#!/usr/bin/env python3
"""
Simple HTTP Server for Gym Tracker
No authentication required
"""

import http.server
import socketserver
import os
import json

PORT = 8080
STATE_FILE = "progress.json"

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")

    def _send_json(self, status, payload):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/api/state":
            try:
                if os.path.exists(STATE_FILE):
                    with open(STATE_FILE, "r", encoding="utf-8") as f:
                        payload = json.load(f)
                else:
                    payload = {}
                return self._send_json(200, payload)
            except Exception as e:
                return self._send_json(500, {"error": str(e)})

        return super().do_GET()

    def do_POST(self):
        if self.path == "/api/state":
            try:
                content_length = int(self.headers.get("Content-Length", "0"))
                raw = self.rfile.read(content_length) if content_length > 0 else b"{}"
                payload = json.loads(raw.decode("utf-8") or "{}")
                with open(STATE_FILE, "w", encoding="utf-8") as f:
                    json.dump(payload, f, ensure_ascii=False)
                return self._send_json(200, {"ok": True})
            except Exception as e:
                return self._send_json(500, {"error": str(e)})

        return super().do_POST()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), SimpleHandler) as httpd:
        print("")
        print("Gym Tracker Server")
        print("=" * 40)
        print(f"URL: http://localhost:{PORT}")
        print("=" * 40)
        print("Press Ctrl+C to stop")
        print("")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    run_server()
