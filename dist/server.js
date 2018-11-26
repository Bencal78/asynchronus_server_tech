"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const metrics_1 = require("./metrics");
const app = express();
const port = process.env.PORT || "8080";
app.get("/", (req, res) => {
    res.write("Hello world");
    res.send();
});
app.get("/metrics", (req, res) => {
    metrics_1.MetricsHandler.get((err, result) => {
        if (err)
            throw err;
        if (result === undefined) {
            res.write("no result");
            res.send();
        }
        else
            res.json(result);
    });
});
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`Server is listening on port ${port}`);
});
