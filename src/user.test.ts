import { expect } from "chai";
import { User, UserHandler } from "./user";
import { LevelDb } from "./leveldb";

const dbPath: string = './db_test'
var dbUser: UserHandler;

describe("Users", function() {
  before(function() {
    LevelDb.clear(dbPath);
    const db = LevelDb.open(dbPath);
    dbUser = new UserHandler(db);
  });

  after(function() {
    dbUser.db.close();
  });

  describe("#get", function() {
    it("should get undefined on non existing User", function() {
      dbUser.get("benjamin", (err: Error | null, result?: User) => {
        if(err){
          expect(err).to.not.be.null;
          expect(result).to.be.undefined;
        }
        else{
          expect(err).to.be.null;
          expect(result).to.not.be.undefined;
        }
      });
    });
  });

  describe("#save", function() {
    let user = {
      username: "benjamin",
      email: "benjamin.callonnec@edu.ece.fr",
      password: "benjamin"
    }
    it("should save a User", function() {
      dbUser.save(user, (err: Error | null) => {
        if(err)
          expect(err).to.not.be.null;
        else
          expect(err).to.be.undefined;
      })
      // TODO
    });

    it("should update a User", function() {
      // TODO
      dbUser.update("francois", user, (err: Error | null) => {
        expect(err).to.be.null;
      })
    });
  });

  describe("#delete", function() {
    it("should delete a User", function() {
      dbUser.delete("benjamin", (err: Error | null) => {
        if(err){
          expect(err).to.not.be.null;
        }
        else{
          expect(err).to.be.undefined;
        }

      })
      // TODO
    });

    it("should not fail if User does not exist", function() {
      dbUser.delete("francois", (err: Error | null) => {
        if(err){
          expect(err).to.not.be.null;
        }
        else{
          expect(err).to.be.undefined;
        }
      })
    });
  });
});
