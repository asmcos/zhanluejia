import requests
import re
import sys
#douyin
ua = "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"


header = {
"User-Agent":ua
}
req = requests.session()

url = "https://v.douyin.com/WrRgHn/"

if(len(sys.argv)) > 1:
	url = sys.argv[1]
	url = re.findall(u'(https://.*/)',sys.argv[1])
	if(len(url)):
		url = url[0]

resp = req.get(url,headers=header)
resp.encoding = "utf-8"

uid = re.findall(u'uid: "(\d+)"',resp.text)
if(len(uid)):
	uid = uid[0]

#nickname = re.findall(u'authorName: "(.*?)"',resp.text)
nickname = re.findall(u'<p class="user-info-name">(.*?)</p>',resp.text)
if(len(nickname)):
	nickname = nickname[0]

itemId = re.findall(u'itemId: "(\d+)"',resp.text)
if(len(itemId)):
	itemId = itemId[0]

userscheme = "snssdk1128://user/profile/%s?refer=web&gd_label=click_wap_download_follow&type=need_follow&needlaunchlog=1"

print(nickname)

if sys.argv[2] == "1":
	print(uid)
else:
	print(itemId)
