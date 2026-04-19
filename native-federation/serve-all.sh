#!/bin/bash
# Serve all Native Federation MFEs using Angular dev server (ng serve)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORTS=(5200 5201 5202 5203)
NAMES=("Shell" "Cart" "Bikes" "Orders")
DIRS=("shell" "cart" "bikes" "orders")
PIDS=()

# --- Check for port conflicts ---
BLOCKED=0
for i in "${!PORTS[@]}"; do
  PORT=${PORTS[$i]}
  PID=$(lsof -ti :$PORT -sTCP:LISTEN 2>/dev/null)
  if [ -n "$PID" ]; then
    echo "❌ Port $PORT (${NAMES[$i]}) is in use by PID $PID"
    BLOCKED=1
  fi
done

if [ "$BLOCKED" -eq 1 ]; then
  echo ""
  read -p "Kill the processes above and continue? [y/N] " REPLY
  if [[ "$REPLY" =~ ^[Yy]$ ]]; then
    for PORT in "${PORTS[@]}"; do
      PID=$(lsof -ti :$PORT -sTCP:LISTEN 2>/dev/null)
      [ -n "$PID" ] && kill $PID 2>/dev/null && echo "  Killed PID $PID on port $PORT"
    done
    sleep 1
  else
    echo "Aborted."
    exit 1
  fi
fi

# --- Cleanup on exit ---
cleanup() {
  echo ""
  echo "🛑 Stopping all dev servers..."
  for PID in "${PIDS[@]}"; do
    kill $PID 2>/dev/null
  done
  wait 2>/dev/null
  echo "All servers stopped."
}
trap cleanup EXIT INT TERM

# --- Start servers ---
echo ""
echo "🚀 Serving all Native Federation MFEs..."
echo ""
echo "  Shell:  http://localhost:5200"
echo "  Cart:   http://localhost:5201"
echo "  Bikes:  http://localhost:5202"
echo "  Orders: http://localhost:5203"
echo ""

for i in "${!DIRS[@]}"; do
  (cd "$SCRIPT_DIR/${DIRS[$i]}" && npm start) &
  PIDS+=($!)
done

echo "All dev servers started. Press Ctrl+C to stop all."
wait
