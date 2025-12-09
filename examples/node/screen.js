// Screen a wallet address with Veria
// npm install axios

const axios = require('axios');

const VERIA_API_KEY = process.env.VERIA_API_KEY;

async function screenAddress(address) {
  const response = await axios.post(
    'https://api.veria.cc/v1/screen',
    { input: address },
    {
      headers: {
        'Authorization': `Bearer ${VERIA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

// Usage
async function main() {
  const result = await screenAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');

  console.log('Risk:', result.risk);
  console.log('Score:', result.score);
  console.log('Sanctions hit:', result.details.sanctions_hit);

  if (result.risk === 'high' || result.risk === 'critical') {
    console.log('BLOCKED: High risk address');
    process.exit(1);
  }

  console.log('ALLOWED: Address is safe');
}

main().catch(console.error);
