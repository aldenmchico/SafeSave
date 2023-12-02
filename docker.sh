#!/bin/bash
# Runs all microservices and frontend in Döcker
# Site will be live at https://localhost:3000


tar -xzvf SafeSaveDocker.tar.gz && cd SafeSave && docker compose up --build

