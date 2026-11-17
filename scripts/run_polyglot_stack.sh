#!/usr/bin/env bash
# ==============================================================================
# 🏛️ Smriti Saarthi — Polyglot Stack Supervisor & Health Orchestrator
# Boots & verifies:
#   1. Rust Spatial Core (:5005)
#   2. Go Telemetry Ingest Hub (:8080)
#   3. Python Cognitive AI Brain (:8000)
#   4. Node.js Gateway & BFF (:4000)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================================${NC}"
echo -e "${GREEN}      🚀 Starting Smriti Saarthi Polyglot Backend Services       ${NC}"
echo -e "${BLUE}=================================================================${NC}"

# 1. Health Probe Helper
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
    return 0
  else
    return 1
  fi
}

# 2. Check Docker Compose Dependencies (Postgres & Redis)
if command -v docker &> /dev/null; then
  echo -e "${YELLOW}🐳 Ensuring Docker services (Postgres :5432, Redis :6379) are active...${NC}"
  docker compose up -d postgres redis mailpit >/dev/null 2>&1 || true
fi

# 3. Status Report
echo ""
echo -e "${BLUE}--- Microservices Status Matrix ---${NC}"

services=(
  "Rust Spatial Engine:5005:services/spatial-rust"
  "Go Detection Hub:8080:services/detection-go"
  "Node.js API Orchestrator:4000:services/api-node"
  "Python Cognitive Brain:8000:backend"
  "Postgres Database:5432:docker"
  "Redis Cache:6379:docker"
)

for entry in "${services[@]}"; do
  IFS=":" read -r name port path <<< "$entry"
  if check_port "$port"; then
    echo -e "  [${GREEN}ONLINE${NC}] $name (Port :$port)"
  else
    echo -e "  [${YELLOW}OFFLINE${NC}] $name (Port :$port)"
  fi
done

echo ""
echo -e "${BLUE}--- Launch Commands (Run in separate terminal tabs) ---${NC}"
echo -e "  1. ${GREEN}Rust Spatial:${NC}   cd services/spatial-rust && cargo run --release"
echo -e "  2. ${GREEN}Go Detection:${NC}   cd services/detection-go && go run cmd/main.go"
echo -e "  3. ${GREEN}Node.js API:${NC}    cd services/api-node && npm start"
echo -e "  4. ${GREEN}Python Brain:${NC}   uvicorn main:app --reload --app-dir backend --port 8000"
echo -e "  5. ${GREEN}React Web App:${NC}  npm run dev"
echo -e "${BLUE}=================================================================${NC}"
