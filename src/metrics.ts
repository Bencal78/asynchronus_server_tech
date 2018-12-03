import { LevelDb } from "./leveldb";
import WriteStream from "level-ws";

export class Metric {
  public timestamp: string;
  public value: number;

  constructor(ts: string, v: number) {
    this.timestamp = ts;
    this.value = v;
  }
}

export class MetricsHandler {
  public db: any;

  constructor(db: any) {
    this.db = db;
  }

  // public save(key: string, met: Metric[], callback: (error: Error | null) => void) {
  //   const stream = WriteStream(this.db);
  //
  //   stream.on("error", callback);
  //   stream.on("close", callback);
  //
  //   met.forEach(m => {
  //     stream.write({ key: `metric:${key}:${m.timestamp}:`, value: m.value });
  //   });
  //
  //   stream.end();
  // }

  // public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
  //   const stream = this.db.createReadStream();
  //   var met: Metric[] = [];
  //
  //   stream
  //     .on("error", callback)
  //     .on("end", (err: Error) => {
  //       callback(null, met);
  //     })
  //     .on("data", (data: any) => {
  //       const [, k, timestamp,] = data.key.split(":");
  //       const value = data.value;
  //       if (key != k) {
  //         console.log(`Level DB error: ${data} does not match key ${key}`);
  //       }
  //       else {
  //         met.push(new Metric(timestamp, value));
  //       }
  //
  //     });
  // }

  // public delete(key: string, met: Metric[], callback: (error: Error | null, result?: Metric[]) => void) {
  //   const stream = this.db.createReadStream();
  //   var met: Metric[] = [];
  //
  //   stream
  //     .on("error", callback)
  //     .on("end", (err: Error) => {
  //       callback(null, met);
  //     })
  //     .on("data", (data: any) => {
  //       const [, k, timestamp,] = data.key.split(":");
  //       const value = data.value;
  //       if (key != k) {
  //         console.log(`Level DB error: ${data} does not match key ${key}`);
  //       }
  //       else {
  //         met.splice( met.indexOf(new Metric(timestamp, value)), 1 );
  //         this.db.del(data.key)
  //       }
  //
  //     });
  // }

  //Retrive metrics
  /*
  params: key default value null
          username default value null
  */
  //default value permit to get all metrics from user if key not specify
  public get(key: string = "", username: string = "", callback: (error: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream();
    var met: Metric[] = [];

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, met);
      })
      .on("data", (data: any) => {
        console.log("data :", data)
        const [, k, timestamp, u] = data.key.split(":");
        const value = data.value;
        if ((key != "" && key != k) || (username != "" && username != u)) {
          console.log(`Level DB error: ${data} does not match key ${key}`);
        }
        else {
          met.push(new Metric(timestamp, value));
        }
      });
  }

  public save(key: string = "", username: string = "", met: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db);
    console.log("met :", met)

    stream.on("error", callback);
    stream.on("close", callback);

    met.forEach(m => {
      stream.write({ key: `metric:${key}:${m.timestamp}:${username}`, value: m.value });
    });

    stream.end();
  }

  public delete(key: string = "", username: string = "", callback: (error: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream();
    var met: Metric[] = [];

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null, met);
      })
      .on("data", (data: any) => {
        const [, k, timestamp, u] = data.key.split(":");
        const value = data.value;
        if ((key != "" && key != k) || (username != "" && username != u)) {
          console.log(`Level DB error: ${data} does not match key ${key}`);
        }
        else {
          met.splice(met.indexOf(new Metric(timestamp, value)), 1 );
          this.db.del(data.key)
        }

      });
  }
}
