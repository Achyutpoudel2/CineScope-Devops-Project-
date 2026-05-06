# CineScope - Movie Mood Dashboard (Frontend-only)

## Overview
CineScope is a single-page app that fetches movie data from OMDb API and displays poster, rating, genre, plot, and cast.

## Files
- index.html, styles.css, app.js - frontend
- config.js - place your OMDb API key here
- Dockerfile - build a container using nginx
- Jenkinsfile - Jenkins pipeline to build, push, and deploy
- k8s/ - Kubernetes deployment and service manifests

## How to run locally
1. Place OMDb API key in config.js
2. Open index.html in a browser (or run via a simple http server)

## Docker
`docker build -t yourusername/cinescope:local .`
`docker run -p 8080:80 yourusername/cinescope:local`
