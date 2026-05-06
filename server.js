const express = require("express");
const client = require("prom-client");
const cors = require("cors");

const app = express();


const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const register = new client.Registry();

client.collectDefaultMetrics({ register });


const requestCounter = new client.Counter({
  name: "cinescope_requests_total",
  help: "Total number of HTTP requests",
  registers: [register]
});

const searchCounter = new client.Counter({
  name: "cinescope_search_total",
  help: "Total number of search requests",
  registers: [register]
});

app.use((req, res, next) => {
  requestCounter.inc();
  next();
});



app.get("/", (req, res) => {
  res.send("CineScope Backend Running");
});

app.get("/search", (req, res) => {
  searchCounter.inc();
  res.json({
    message: "Search tracked successfully"
  });
});

/* ---------------- METRICS ENDPOINT ---------------- */
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`CineScope running on http://localhost:${PORT}`);
});
