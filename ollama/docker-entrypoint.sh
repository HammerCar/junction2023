#!/bin/sh

{ sleep 2; /bin/ollama pull llama2; } &

/bin/ollama serve