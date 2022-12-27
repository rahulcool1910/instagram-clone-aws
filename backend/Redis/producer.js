import { createClient } from 'redis';
import { Client } from 'redis-om';

const redis = createClient({ url: 'redis://localhost:6379' });
await redis.connect();
const client = await new Client().use(redis);

import fs from 'fs';
import { parse } from 'csv-parse';
fs.readFile('../../../examples/OnlineRetail.csv', function (err, fileData) {
  parse(fileData, { columns: false, trim: true }, function (err, rows) {
    for (let row of rows) {
      if (!row) {
        continue;
      }
      console.log('🚀 ~ file: test.js:13 ~ row', row);
      console.log('🚀 ~ file: producer.js:17 ~ row', row.length);
      redis.xAdd('order', '*', row);
    }
  });
});
