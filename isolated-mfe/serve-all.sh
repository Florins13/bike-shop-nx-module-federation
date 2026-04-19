#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PIDS=()

cleanup() {
  echo ""
  echo "Shutting down all MFEs..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  echo "All MFEs stopped."
}
trap cleanup EXIT INT TERM

start_mfe() {
  local name=$1 port=$2 extra=$3 dir="$SCRIPT_DIR/$1"
  echo "Starting $name on port $port... $extra"
  (cd "$dir" && npx ng serve --port "$port" $extra 2>&1 | sed "s/^/[$name] /") &
  PIDS+=($!)
}

echo "=== Isolated MFE Dev Servers ==="
echo ""

# Free up ports if anything is lingering (only kill actual servers, not browser sockets)
echo "Clearing ports 5200-5203..."
for p in 5200 5201 5202 5203; do
  pid=$(lsof -i :$p -sTCP:LISTEN -t 2>/dev/null || true)
  if [ -n "$pid" ]; then
    kill "$pid" 2>/dev/null || true
    echo "  Killed server on port $p (PID $pid)"
  fi
done
sleep 1

start_mfe cart   5201 "--live-reload=false"
start_mfe bikes  5202 "--live-reload=false"
start_mfe orders 5203 "--live-reload=false"

# Wait for remotes to be ready before starting the host
echo ""
echo "Waiting for remotes to compile..."
for port in 5201 5202 5203; do
  printf "  Waiting for port $port"
  for i in $(seq 1 60); do
    if curl -s -o /dev/null http://localhost:$port 2>/dev/null; then
      echo " ✓"
      break
    fi
    printf "."
    sleep 2
  done
done
echo ""

start_mfe shell  5200

echo ""
echo "Shell  → http://localhost:5200"
echo "Cart   → http://localhost:5201"
echo "Bikes  → http://localhost:5202"
echo "Orders → http://localhost:5203"
echo ""
echo "Press Ctrl+C to stop all."

wait
