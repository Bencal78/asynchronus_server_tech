#!/usr/bin/env ts-node

import { MetricsHandler, Metric } from './src2/metrics'

const dbMet = new MetricsHandler('db/metrics')

const met = [
  new Metric('2013-11-04 14:00 UTC', 12),
  new Metric('2013-11-04 14:10 UTC', 13)
]

dbMet.save(0, met, (err: Error | null) => {
  if (err) throw err
  console.log('Metrics saved')
})
