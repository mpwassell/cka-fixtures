import requests,os

upload_dir = r"D:\Mark\CKAWebSite\Upload"
base_url = "http://127.0.0.1:8000"

res = requests.get("http://127.0.0.1:8000/cka/fixtures/played")
scorecards = res.text.split("\n")

print(scorecards)


def wget(url,target):
    resp = requests.get(url)
    with open(os.path.join(upload_dir,target),"w",encoding="utf-8") as f:
        txt = resp.text.replace("/static/ckaleague/","")
        txt = txt.replace("cka/results/", "")
        f.write(txt)

for res in scorecards:
    res=res.strip()
    if not res:
        continue
    print("RES = {}".format(res))
    wget("http://127.0.0.1:8000/cka/results/Upload/{}.htm".format(res), "{}.htm".format(res))
    wget("http://127.0.0.1:8000/cka/results/Upload/{}_int.htm".format(res), "{}_int.htm".format(res))


for json in [ "fixtures", "teams", "matches", "venues", "player_statistics", "players", "clubs" , "league_tables"]:
    resp = requests.get(base_url + "/cka/" + json + ".json")
    with open(os.path.join(upload_dir,json + ".json"),"w",encoding="utf-8") as f:
        f.write(resp.text)

wget("http://localhost:8000/cka/player/status", "status.html")

wget("http://127.0.0.1:8000/cka/fixtures" , "FixtureList.htm")

wget("http://127.0.0.1:8000/cka/division/1", "Division1.htm")
wget("http://127.0.0.1:8000/cka/division/2", "Division2.htm")
wget("http://127.0.0.1:8000/cka/division/3", "Division3.htm")

for i in [1,2,3]:
    wget("http://127.0.0.1:8000/cka/division/scorers/{}".format(i), "Stats{}.htm".format(i))

wget("http://127.0.0.1:8000/cka/division/scorers/SERL", "Stats-1.htm")
wget("http://127.0.0.1:8000/cka/division/scorers/NL", "Stats0.htm")



for team in [ 'CIT0', 'CIT1', 'CIT2', 'CIT3', 'CIT4', 'CIT5', 'LIT1', 'LIT2', 'LIT3', 'PHO0', 'PHO1', 'PHO2', 'PHO3', 'PHO4', 'TIGNL', 'TIG0'
            'TIG1', 'TIG2', 'TIG3', 'TIG4', 'TIG5',  'UNI1', 'UNI2' ,'VIK0', 'VIK1', 'VIK2' , 'VIK3',  'VIK4' ]:
    wget("http://127.0.0.1:8000/cka/season/{}".format(team), "{}.htm".format(team))