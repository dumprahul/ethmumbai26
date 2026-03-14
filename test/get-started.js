require('dotenv').config();
const { BitGoAPI } = require('@bitgo/sdk-api');
const { Eth } = require('@bitgo/sdk-coin-eth');

function stripPlaceholders(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/^<|>$/g, '').trim();
}

async function main() {
  const rawToken = process.env.ACCESS_TOKEN || process.env.BITGO_ACCESS_TOKEN;
  const accessToken = stripPlaceholders(rawToken);
  const env = stripPlaceholders(process.env.ENV) || 'test';

  if (!accessToken) {
    console.error('Missing ACCESS_TOKEN or BITGO_ACCESS_TOKEN in .env');
    process.exit(1);
  }

  const bitgo = new BitGoAPI({ env, accessToken });
  bitgo.register('eth', Eth.createInstance);

  // Verify authentication by fetching your user profile
  const user = await bitgo.me();
  console.log('Authenticated as:', user.username);
  console.log('User ID:', user.id);
}

main().catch(console.error);
