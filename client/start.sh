#!/bin/bash
echo "[CLIENT] Initializing Sub-OS..."
# Using --host to ensure it binds accessible interfaces if needed, 
# though localhost is the target.
npm run dev -- --host
