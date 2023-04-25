#!/bin/bash
docker run --platform linux/amd64 -v /Users/vinaysshenoy/Dev/resume:/resume there4/markdown-resume md2resume pdf --template readable ./resume.md ./
