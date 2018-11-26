import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
    LevelDb.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.db.close()
  })

  describe('#get', function () {
    it('should get empty array on non existing group', function () {
      dbMet.get("0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.an('array')
        expect(result).to.be.empty
      })
    })
  })

  describe('#save', function() {
    //const metrics: Metric[] = [new Metric(...)]
    it('should save data', function(){

    })
    it('should update data', function(){
      //save
        //update
          //delete
    })
  })

  describe('#delete', function() {
    it('should delete data', function(){

    })
    it('should not failed if data does not exist', function(){

    })
  })
})
