import { createClient, commandOptions } from 'redis';
import { Client } from 'redis-om';

const redis = createClient({ url: 'redis://localhost:6379' });
await redis.connect();
const client = await new Client().use(redis);
let currentId = '0-0'; // Start at lowest possible stream ID
const test = async () => {
  console.log('🚀 ~ file: test.js:20 ~ true', true);
  const received = await redis.xRead(
    commandOptions({
      isolated: true,
    }),
    [
      // XREAD can read from multiple streams, starting at a
      // different ID for each...
      {
        key: 'order',
        id: currentId,
      },
    ],
    {
      // Read 1 entry at a time, block for 5 seconds if there are none.
      COUNT: 1,
      BLOCK: 5000,
    }
  );
  if (!received) return;
  currentId = received[0].messages[0].id;
  console.log(
    '🚀 ~ file: consumer.js:30 ~ test ~ received[0].messages[0]',
    received[0].messages[0].message
  );
  console.log('🚀 ~ file: test.js:21 ~ received', received[0]);
};

setInterval(() => {
  test();
}, 2000);
