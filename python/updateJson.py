import json, urllib
from urllib.request import Request, urlopen
from urllib.error import URLError

def pullJsons():

    baseURL = 'https://poe.ninja/api/data/itemoverview'
    headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'}
    league = 'Heist'
    types = [
        'SkillGem',
        'UniqueJewel',
        'UniqueFlask',
        'UniqueWeapon',
        'UniqueArmour',
        'UniqueAccessory'
    ]

    for itemType in types:

        print("Downloading JSON for type: "+itemType)

        data = {
            'league': league,
            'type': itemType
        }
        #data = urllib.parse.urlencode(data)
        #data = data.encode('utf-8')
        req = Request( baseURL, headers )
        req.add_header('league', league)
        req.add_header('type', itemType)

        url = baseURL+'?league='+league+'&type='+itemType+'&language=en'
        print(url)
        req = Request(url, headers=headers)
        
        try: 
            #print( req )    
            #response = urlopen(url, headers=headers)
            response = urlopen(req)
            jsonData = json.loads(response.read())
        except URLError as e:
            if hasattr(e, 'reason'):
                print('Failed to contact server. Reason ' + e.reason)
            elif hasattr(e, 'code'):
                print('Failed to fulfill request. Reason ' + e.code)
        else:
            fileName = itemType+'.json' 
            print(fileName)
            with open(fileName, 'w') as outfile:
                json.dump(jsonData, outfile)
                print("Saved "+fileName)

    return "Complete"

pullJsons()