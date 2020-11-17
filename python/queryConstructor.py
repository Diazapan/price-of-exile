import json

def constructQuery(item):

    query = { 
                "query": {
                    "status": {
                        "option": "online"
                    },
                    "filters": {
                        "trade_filters": {
                            "disabled": False,
                            "filters": {
                                "sale_type": {
                                    "option": "priced"
                                }
                            }
                        }
                    },
                    },
                    "sort": {
                        "price": "asc"
                    }
            }
    
    if item['frameType'] == 3:
        query['query']['name'] = item['name']
    else:
        query['query']['term'] = item['typeLine']

    if 'sockets' in item:
        query['query']['filters']['socket_filters'] = {
            'disabled': False,
            'filters': {
                'sockets':{
                    #'min': len(item['sockets']),
                    'min': 2,
                    'max': 2
                    #'max': len(item['sockets'])
                }
            }
        }


    return query