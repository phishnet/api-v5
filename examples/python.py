# Usage: PHISHNET_API_KEY=your_key python examples/python.py   (pip install requests)
import os
import requests

res = requests.get(
    "https://api.phish.net/v5/setlists/showdate/1997-11-22.json",
    headers={"X-API-KEY": os.environ["PHISHNET_API_KEY"]},
    timeout=10,
)
res.raise_for_status()

for row in res.json()["data"]:
    print(f"Set {row['set']}: {row['song']}{row['trans_mark']}")
