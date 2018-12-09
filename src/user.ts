import bcrypt = require('bcryptjs')
import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'

export class UserHandler {
  public db: any

  constructor(db: any) {
    this.db = db
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    return this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if(data === undefined) callback(null, data)
      else callback(null, User.fromDb(username, data))
    });
  }

  public save(user: any, callback: (err: Error | null) => void) {
    // TODO
    user = new User(user.username, user.email, user.password)
    this.db.put(`user:${user.username}`, `${user.getPassword()}: ${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public update(old_user: any, new_user: any,  callback: (err: Error | null, result?: User) => void) {
    const stream = this.db.createReadStream();

    stream
      .on("error", callback)
      .on("end", (err: Error) => {
        callback(null);
      })
      .on("data", (data: any) => {
        const [, u] = data.key.split(":");
        if (old_user != "" && old_user != u) {
          console.log(`Level DB error: ${data}`);
        }
        else {
          this.db.del(data.key)
          const stream_save = WriteStream(this.db);
          let user = new User(new_user.username, new_user.email, new_user.password)

          stream_save.on("error", callback);
          stream_save.on("close", callback);

          stream_save.write({ key: `user:${user.username}`, value: `${user.getPassword()}: ${user.email}` });

          stream_save.end();
        }
      });
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`, (err: Error | null) => {
        callback(err);
      });
  }
}

export class User {
  public username: string
  public email: string
  private password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      this.setPassword(password)
    } else this.password = password
  }

  static fromDb(username: string, value: any): User {
    // Parse db result and return a User
    const [password, email] = value.split(":")
    return new User(username, email, password, true)
  }

  public setPassword(toSet: string): void {
    // Hash and set password
    this.password = bcrypt.hashSync(toSet, '$2a$10$nidzfv0TvesHSgSF3IKxle')
  }

  // public getPassword(): string {
  //   return this.password
  // }

  public getPassword = () => {
    return this.password
  }

  public async validatePassword(toValidate: String) {
    // return comparison with hashed password
    let password = bcrypt.hashSync("benjamin", '$2a$10$nidzfv0TvesHSgSF3IKxle')
    const match = bcrypt.compareSync(toValidate, this.password);
    return match
  }

}
