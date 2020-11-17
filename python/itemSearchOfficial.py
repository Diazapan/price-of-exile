import json, urllib, queryConstructor
from urllib.request import Request, urlopen
from urllib.error import URLError
from time import sleep

def itemSearch( character, item ):

    url = 'https://www.pathofexile.com/api/trade/search/' + character['character']['league']

    
    query = queryConstructor.constructQuery(item)


    #data = urllib.parse.urlencode(query)
    #data = data.encode('ascii')
    data = json.dumps(query).encode('utf-8')

    headers = { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36',
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': len(data)
    }
    
    req = Request(url, data, headers)

    try: 
        response = urlopen(req)
        jsonData = json.loads(response.read())
    except URLError as e:
        if hasattr(e, 'reason'):
            print('Failed to contact server. Reason ' + e.reason)
        elif hasattr(e, 'code'):
            print('Failed to fulfill request. Reason ' + e.code)
    else:
        
        url = 'https://www.pathofexile.com/api/trade/fetch/' #317ce4951483209ed1b2d63a8e4faa754a4aaa1814903afecd8ea2aa6e64407a?query=k75Qlr6h5'
        res = []
        listcount = 0
        if not jsonData['id'] or not jsonData['result']:
            return "Missing trade id or results."
        for itemID in jsonData['result']:
            
            listcount = listcount + 1
            if(listcount > 1):
                return res

            headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36' }
            req = Request( url + itemID +"?query="+str(jsonData['id']), headers=headers)

            try: 
                response = urlopen(req)
                itemListingJson = json.loads(response.read())
            except URLError as e:
                if hasattr(e, 'reason'):
                    print('Failed to contact server. Reason ' + e.reason)
                    return "Rate Limit Exceeded"
                elif hasattr(e, 'code'):
                    print('Failed to fulfill request. Reason ' + e.code)
            else:
                itemTemplate = {
                    'price': itemListingJson['result'][0]['listing']['price'],
                    'extended': itemListingJson['result'][0]['item']['extended']
                }
                res.append(itemTemplate)
                res.append(itemListingJson)
                sleep(0.5)
        return res
    return "Item not found."
