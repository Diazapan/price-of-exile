import json, urllib, queryConstructor, base64
from urllib.request import Request, urlopen
from urllib.error import URLError
from time import sleep

def itemSearch( itemString, league ):
    
    #url = 'https://www.poeprices.info/api'
    item_encode = base64.b64encode(itemString.encode('utf-8'))
    url = 'https://www.poeprices.info/api?l='+league+"&i="+item_encode.decode('ascii')
    #data = {
    #    'l': league,
    #    'i': item_encode.decode('ascii')
    #}

    #req = Request(url, data)
    #print( itemString+" - " +url )
    try: 
        response = urlopen(url)
        jsonData = json.loads(response.read())
    except URLError as e:
        if hasattr(e, 'reason'):
            print('Failed to contact server. Reason ' + e.reason)
        elif hasattr(e, 'code'):
            print('Failed to fulfill request. Reason ' + e.code)
    else:
        if jsonData['error'] != 0:
            defaultJson = {
                "min": 0, 
                "max": 0, 
                "currency": "chaos", 
                "error": jsonData['error']
            }
            return defaultJson
        return jsonData
    return "Error connecting to poeprices.info"