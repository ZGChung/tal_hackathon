#!/bin/bash
# Start script for Render deployment
# This ensures PYTHONPATH is set correctly

export PYTHONPATH="${PYTHONPATH}:$(pwd)"
cd /opt/render/project/src || cd "$(dirname "$0")/.." || exit 1
exec uvicorn backend.main:app --host 0.0.0.0 --port "${PORT:-8000}"

