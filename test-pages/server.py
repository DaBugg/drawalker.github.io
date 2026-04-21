#!/usr/bin/env python3
"""
Atlas — tiny static dev server.

Zero external dependencies. Serves ./public on http://localhost:<port>.
Everything useful is plain HTML/CSS/JS under public/, so when you're
ready to move this into Next.js / Astro / Remix / Vite / etc., just
copy the public/ folder and re-wire the script tags.

Usage:
    python3 server.py          # default port 8000
    python3 server.py 3000     # custom port
"""

from __future__ import annotations

import os
import sys
import http.server
import socketserver
from functools import partial

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """Disables caching so edits show up on refresh during development."""

    # Ensure .svg and other modern mimetypes are correct across platforms.
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".svg":  "image/svg+xml",
        ".js":   "application/javascript",
        ".mjs":  "application/javascript",
        ".css":  "text/css",
        ".html": "text/html; charset=utf-8",
        ".json": "application/json",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Slightly prettier log line
        sys.stderr.write("  %s  %s\n" % (self.log_date_time_string(), fmt % args))


def main():
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}", file=sys.stderr)
            sys.exit(1)

    if not os.path.isdir(ROOT):
        print(f"Missing public/ directory at {ROOT}", file=sys.stderr)
        sys.exit(1)

    handler = partial(NoCacheHandler, directory=ROOT)

    # Allow quick restart on the same port.
    socketserver.TCPServer.allow_reuse_address = True

    with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
        print(f"\n  ATLAS dev server")
        print(f"  ────────────────")
        print(f"  serving  ./public")
        print(f"  on       http://localhost:{port}")
        print(f"  ctrl-c   to stop\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  stopped.\n")


if __name__ == "__main__":
    main()
