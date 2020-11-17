import flask, json, urllib, itemSearch, base64
from itemSearch import itemSearch
from flask_cors import CORS, cross_origin
from flask import request, jsonify
from urllib.request import Request, urlopen
from urllib.error import URLError

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# http://127.0.0.1:5000/api/v1/character?accountName=Diazapan&character=FrankOceansEleven
# accountName=Diazapan&character=FrankOceansEleven


@app.route('/', methods=['GET'])
def home():
    return "<h1>POE Character API</h1><p>This site is a prototype API for pulling character data from the official POE API.</p>"

# Return all the character names of the associated account
@app.route('/api/v1/character-list', methods=['GET'])
@cross_origin()
def api_account():
    if 'accountName' in request.args:
        accountName = str(request.args['accountName'])
    else:
        return jsonify('Invalid Account Name')
    
    url = 'https://www.pathofexile.com/character-window/get-characters'
    values = { 'accountName': accountName }
    headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii')
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
        # If verbose just dump the whole json
        if 'verbose' in request.args:
            return jsonify(jsonData)

        charList = []
        for char in jsonData:
            charList.append({
                'name': char['name'],
                'league': char['league']
                })
        
        return jsonify(charList)

    return jsonify('Unable to retrieve account.')

def parseProperty( prop ):
    if 'displayMode' in prop:
        
        if prop['displayMode'] == 0:
            string = prop['name'] + ": "
            for i in range(len(prop['values'])):
                string = string +str(prop['values'][i][0])
            return string

        if prop['displayMode'] == 1:
            string = prop['name'] + ": "
            for i in range(len(prop['values'])):
                string = string +str(prop['values'][i][0])
            return string

        if prop['displayMode'] == 2:
            string = prop['name'] + ": "
            for i in range(len(prop['values'])):
                string = string +str(prop['values'][i][0])
            return string

        if prop['displayMode'] == 3:
            string = prop['name']
            values = []
            for i in range(len(prop['values'])):
                values.append( str(prop['values'][i][0]) )
            string = string.format(*values)
            return string
        return str(prop)
    return ""

# A route to return all of the available entries in our catalog.
@app.route('/api/v1/character-details', methods=['GET'])
@cross_origin()
def api_all():
    if 'accountName' in request.args:
        accountName = str(request.args['accountName'])
    else:
        return jsonify('Account Name required')

    if 'character' in request.args:
        character = str(request.args['character'])
    else:
        return jsonify('Character Name required')

    url = 'https://www.pathofexile.com/character-window/get-items'
    values = { 
                'accountName': accountName,
                'character': character
             }
    headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'}

    data = urllib.parse.urlencode(values)
    data = data.encode('ascii')
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
        # If verbose just dump the whole json
        if 'verbose' in request.args:
            return jsonify(jsonData)
       
        json_output = {}
        json_output['character'] = {
            'name': jsonData['character']['name'],
            'league': jsonData['character']['league']
        }
        json_output['items'] = []
        for item in jsonData['items']:
            item_json = {
                'name': item['name'],
                'typeLine': item['typeLine'],
                'frameType': item['frameType'],
                'inventoryId': item['inventoryId'],
                'icon': item['icon']
                }

            if 'explicitMods' in item:
                item_json['explicitMods'] = item['explicitMods']
            if 'implicitMods' in item:
                item_json['implicitMods'] = item['implicitMods']
            if 'craftedMods' in item:
                item_json['craftedMods'] = item['craftedMods']
            if 'sockets' in item:
                item_json['sockets'] = item['sockets']
            if 'influence' in item:
                item_json['influence'] = item['influence']
            if 'socketedItems' in item:
                item_json['socketedItems'] = item['socketedItems']
            if 'corrupted' in item:
                item_json['corrupted'] = True
            if 'synthesised' in item:
                item_json['synthesised'] = True

            rarity_switch = {
                0: 'Normal',
                1: 'Magic',
                2: 'Rare',
                3: 'Unique'
            }
                
            textStr = "Rarity: "
            textStr = textStr + rarity_switch.get(item['frameType'], 0) + "\n"
            if item['name'] != "":
                textStr = textStr + item['name'] + "\n"
            textStr = textStr + item['typeLine'] + "\n"
            
            if 'properties' in item:
                textStr = textStr + '--------\n'
                for prop in item['properties']:
                    textStr = textStr + parseProperty(prop) + "\n"
            
            if 'requirements' in item:
                textStr = textStr + '--------\n'
                textStr = textStr + 'Requirements:\n'
                for req in item['requirements']:
                    textStr = textStr + parseProperty(req) + "\n"
            
            if 'sockets' in item:
                textStr = textStr + '--------\n'
                textStr = textStr + 'Sockets:\n'
                socketGroups = {}
                for socket in item['sockets']:
                    if socket['group'] in socketGroups:
                        socketGroups[socket['group']] = socketGroups[socket['group']] + "-" + socket['sColour']
                    else:
                        socketGroups[socket['group']] = socket['sColour']
                for group in socketGroups:
                    textStr = textStr + str(socketGroups[group]) +" "
                textStr = textStr + "\n"

            textStr = textStr + '--------\n'
            textStr = textStr + 'Item Level: ' + str(item['ilvl']) + '\n'

            if 'implicitMods' in item:
                textStr = textStr + '--------\n'
                for mod in item['implicitMods']:
                    textStr = textStr + mod + ' (implicit)\n'

            if 'explicitMods' in item:
                textStr = textStr + '--------\n'
                for mod in item['explicitMods']:
                    textStr = textStr + mod +'\n'

            if 'craftedMods' in item:
                for mod in item['craftedMods']:
                    textStr = textStr + mod + ' (crafted)\n'
            
            if 'corrupted' in item:
                textStr = textStr + '--------\n'
                textStr = textStr + 'Corrupted\n'

            if 'influences' in item:
                textStr = textStr + '--------\n'
                for inf in item['influences']:
                    textStr = textStr + inf.capitalize() + ' Item\n'

            item_json['textStr'] = textStr
            item_json['b64'] = str(base64.b64encode(textStr.encode('ascii')),'utf-8')

            #json_output['items'].append(item_json)
            #return jsonify(itemSearch(json_output, item))
            #json_output['items'].append(itemSearch(json_output,item))
            #if item['frameType'] == 2:
                #item_json['priceInfo'] = itemSearch(item_json['textStr'], jsonData['character']['league'] )
            json_output['items'].append(item_json)

        return jsonify(json_output)


    return jsonify('Unable to retrieve character details')

# Get rare price info from poeprice.info
@app.route('/api/v1/item', methods=['GET'])
@cross_origin()
def api_itemPrice():

    if 'b64' in request.args and 'league' in request.args:
        b64 = request.args['b64']
        league = request.args['league']
        url = 'https://www.poeprices.info/api?l='+league+"&i="+b64

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

        #return jsonify(itemSearch(b64, league))

    return jsonify('Invalid args')

# Get gem price info
@app.route('/api/v1/gem', methods=['GET'])
@cross_origin()
def api_gem():

    if 'name' in request.args and 'level' in request.args and 'quality' in request.args:
        name = urllib.parse.unquote(request.args['name'])
        level = int(request.args['level'])
        quality = int(request.args['quality'])
        corrupted = False

        #Some logic to return prices for gems with mismatched quality+level
        if quality < 20:
            quality = 0
        elif quality < 23:
            quality = 20

        if 'Empower' in name or 'Enlighten' in name or 'Enhance' in name:
            level = level
        elif 'Awakened' in name:
            if level < 5:
                level = 1
        elif 'Brand Recall' in name:
            if level < 6:
                level = 1
        else:
            if level < 20:
                level = 1

        if 'corrupted' in request.args:
            corrupted = bool(request.args['corrupted'])

        with open('SkillGem.json') as jsonFile:
            jsonData = json.load(jsonFile)

            out = {
                'name': name,
                'level': level,
                'qual': quality,
                'chaosValue': 0,
                'exaltValue': 0
            }

            for line in jsonData['lines']:
                
                #return jsonify(out)
                if line['name'] == name and line['gemLevel'] == level and line['gemQuality'] == quality:
                    if corrupted:
                        if line['corrupted'] == True:
                            out['chaosValue'] = line['chaosValue']
                            out['exaltedValue'] = line['exaltedValue']
                            #out['json'] = line
                    else:
                        if line['corrupted'] == False:
                            out['chaosValue'] = line['chaosValue']
                            out['exaltedValue'] = line['exaltedValue']
                            #out['json'] = line                

        return jsonify(out)

    return jsonify('Missing args')

#Get unique item price info from stored JSONs
@app.route('/api/v1/unique', methods=['GET'])
@cross_origin()
def api_unique():

    if 'name' in request.args and 'type' in request.args:
        name = urllib.parse.unquote(request.args['name'])
        itemType = urllib.parse.unquote(request.args['type'])
        
        out = []
        with open('Unique'+itemType+'.json') as jsonFile:
            jsonData = json.load(jsonFile)
            for line in jsonData['lines']:
                if line['name'] == name:
                    #return jsonify(line)
                    out.append(line)

        if len(out) == 0 and itemType == 'Armour':
            with open('UniqueWeapon.json') as jsonFile:
                jsonData = json.load(jsonFile)
                for line in jsonData['lines']:
                    if line['name'] == name:
                        #return jsonify(line)
                        out.append(line)
        

        return jsonify(out)
    return jsonify('Missing args')

app.run()