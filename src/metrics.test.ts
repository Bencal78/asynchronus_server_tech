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
      dbMet.get("0", "benjamin", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.an('array')
        expect(result).to.be.empty
      })
    })
  })

  describe('#save', function() {
    const metrics: Metric[] = [new Metric(new Date().getTime().toString(), 3), new Metric(new Date().getTime().toString(), 4)]

    it('should save data', function(){
      dbMet.save('1', "", metrics, function(err: Error | null) {
        expect(err).to.be.null
      })
    })
    it('should update data', function(){
      dbMet.update('1', "", metrics, function(err: Error | null) {
        expect(err).to.be.null
      })
    })
  })

  describe('#delete', function() {
    it('should delete data', function(){
      dbMet.delete('1', "", function(err: Error | null) {
        expect(err).to.be.null
      })
    })
    it('should not failed if data does not exist', function(){
      dbMet.delete('2', "francois", function(err: Error | null) {
        expect(err).to.be.null
      })
    })
  })
})
