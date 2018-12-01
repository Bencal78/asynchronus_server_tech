import { expect } from "chai";
import { User, UserHandler } from "./users";
import { LevelDb } from "./leveldb";

const dbPath: string = "db_test/users";
var dbUser: UserHandler;

describe("Users", function() {
  before(function() {
    LevelDb.clear(dbPath);
    dbUser = new UserHandler(dbPath);
  });

  after(function() {
    dbUser.db.close();
  });

  describe("#get", function() {
    it("should get undefined on non existing User", function() {
      dbUser.get("benjamin", (err: Error | null, result?: User) => {
        expect(err).to.be.null;
        expect(result).to.not.be.undefined;
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
        expect(err).to.be.null;
      })
      // TODO
    });

    it("should update a User", function() {
      // TODO
    });
  });

  describe("#delete", function() {
    it("should delete a User", function() {
      dbUser.delete("benjamin", (err: Error | null) => {
        expect(err).to.be.null;
      })
      // TODO
    });

    it("should not fail if User does not exist", function() {
      dbUser.delete("francois", (err: Error | null) => {
        expect(err).to.be.null;
      })
    });
  });
});
