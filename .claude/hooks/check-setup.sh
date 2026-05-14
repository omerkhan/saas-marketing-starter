#!/usr/bin/env bash
# SessionStart hook: nudge Claude to run the setup skill if the starter
# has not been personalized yet.

set -euo pipefail

SETUP_FILE=".claude/setup.json"

if [ -f "$SETUP_FILE" ] && grep -q '"setup_complete": true' "$SETUP_FILE"; then
  # Already set up. Stay silent.
  exit 0
fi

cat <<'EOF'
[FIRST-TIME SETUP REQUIRED]

This repo is a fresh clone of the saas-marketing-starter template. The
marker at .claude/setup.json shows "setup_complete": false, meaning the
site still has the default Loop branding and copy.

Your first action this session must be to invoke the `setup` skill (at
.claude/skills/setup/SKILL.md). It walks the founder through ~4 short
questions and then renames Loop to their product across the right files.

Do this before responding to any other request. If the founder explicitly
says they want to skip setup, edit .claude/setup.json to set
"setup_complete": true so this nudge stops appearing.
EOF
