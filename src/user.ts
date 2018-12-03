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
    console.log("password sign in:", user.getPassword())
    this.db.put(`user:${user.username}`, `${user.getPassword()}: ${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`, (err: Error | null) => {
        callback(err);
      }
    );
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
    console.log("to set :", toSet)
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
    console.log("to validate :", toValidate)
    console.log("this password :", this.password)
    console.log("password :", password)
    const match = bcrypt.compareSync(toValidate, this.password);
    console.log("here :", match)
    return match
  }

}
