#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

# Create logs directory
mkdir -p logs

python manage.py collectstatic --no-input --verbosity 2
python manage.py migrate --verbosity 2

echo "Build completed successfully"

