import requests
import re
import sys

#kuaishou

ua = "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"


header = {
"User-Agent":ua
}
req = requests.session()

url = " https://v.kuaishou.com/s/xFcrbLcD"

if(len(sys.argv)) > 1:
	url = sys.argv[1]
	url = re.findall(u'(https://.*) ',sys.argv[1])
	if(len(url)):
		url = url[0]

resp = req.get(url,headers=header)
resp.encoding = "utf-8"


uid = re.findall(u'"kwai://profile/(\d+)"',resp.text)
if(len(uid)):
	uid = uid[0]

nickname = re.findall(u'<div class="auth-name">(.*?)</div>',resp.text)
if(len(nickname)):
	nickname = nickname[0]

photoId = re.findall(u'"kwai://work/(\d+)',resp.text)
if(len(photoId)):
	photoId = photoId[0]


print(nickname)
if sys.argv[2] == "1":
	print(uid)
else:
	print(photoId)
