import urllib.request
import os

# Socket.IO 클라이언트 라이브러리 다운로드
url = "https://cdn.jsdelivr.net/npm/socket.io-client@4.7.2/dist/socket.io.min.js"
output_path = os.path.join("frontend", "socket.io.min.js")

print(f"Downloading Socket.IO client from {url}...")
try:
    urllib.request.urlretrieve(url, output_path)
    print(f"✅ Successfully downloaded to {output_path}")
except Exception as e:
    print(f"❌ Failed to download: {e}")
    print("\nManual download instructions:")
    print(f"1. Visit: {url}")
    print(f"2. Save the file as: {output_path}")
