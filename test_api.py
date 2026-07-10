import urllib.request
import json

url = "http://127.0.0.1:8000/api/auth/signup"
headers = {
    "Origin": "https://dev-pilot-ai-ten.vercel.app",
    "Content-Type": "application/json"
}
data = {
    "email": "test123456@test.com",
    "password": "password123"
}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
        print("Body:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Status:", e.code)
    print("Headers:", e.headers)
    print("Body:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)

