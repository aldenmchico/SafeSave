#!/bin/bash
# Runs all microservices and frontend in Döcker
# Site will be live at https://localhost:3000


mkdir SafeSaveDocker && tar -xzvf SafeSaveDocker.tar.gz -C SafeSaveDocker && cd SafeSaveDocker/SafeSave && docker compose up --build
