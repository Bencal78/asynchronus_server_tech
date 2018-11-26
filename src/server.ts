import express = require("express");
import { MetricsHandler, Metric } from "./metrics";
import bodyparser = require("body-parser");

const app = express();
const port: string = process.env.PORT || "8080";

const dbMet = new MetricsHandler("./db");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.get("/", (req: any, res: any) => {
  res.write("Hello world");
  res.send();
});

app.get("/metrics/:id", (req: any, res: any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
    if (err) throw err;
    if (result === undefined) {
      res.write("no result");
      res.send();
    } else res.json(result);
  });
});

app.post("/metrics/:id", (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) {
      res.status(500);
      throw err;
    }
    res.status(200).send();
  });
});

app.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`Server is listening on port ${port}`);
});
