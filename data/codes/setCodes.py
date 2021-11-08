import json
import os
import urllib.request
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

# 環境変数からRESAS-API-KEYを取得
from dotenv import load_dotenv
load_dotenv()
RESAS_API_KEY = os.getenv('RESAS_API_KEY')

# RESAS-APIから都道府県一覧を取得を取得
url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures'
req = urllib.request.Request(url, headers={'X-API-KEY': RESAS_API_KEY})
with urllib.request.urlopen(req) as response:
    data = response.read()
prefList = json.loads(data.decode())

# 都道府県一覧をJSONファイルに保存
with open('data/codes/preflist.json', 'w') as f:
    json.dump(prefList, f, ensure_ascii=False, indent=4)

# RESAS-APIから市区町村一覧を取得
url = 'https://opendata.resas-portal.go.jp/api/v1/cities'
req = urllib.request.Request(url, headers={'X-API-KEY': RESAS_API_KEY})
with urllib.request.urlopen(req) as response:
    data = response.read()
cityList = json.loads(data.decode())

# 市区町村一覧をJSONファイルに保存
with open('data/codes/citylist.json', 'w') as f:
    json.dump(cityList, f, ensure_ascii=False, indent=4)
