"""Screen a wallet address with Veria"""
# pip install requests

import os
import requests

VERIA_API_KEY = os.environ.get('VERIA_API_KEY')

def screen_address(address: str) -> dict:
    response = requests.post(
        'https://api.veria.cc/v1/screen',
        json={'input': address},
        headers={
            'Authorization': f'Bearer {VERIA_API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    response.raise_for_status()
    return response.json()


if __name__ == '__main__':
    result = screen_address('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')

    print(f"Risk: {result['risk']}")
    print(f"Score: {result['score']}")
    print(f"Sanctions hit: {result['details']['sanctions_hit']}")

    if result['risk'] in ('high', 'critical'):
        print('BLOCKED: High risk address')
        exit(1)

    print('ALLOWED: Address is safe')
