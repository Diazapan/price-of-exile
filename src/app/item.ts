
export interface Item {

    name: string;
    typeLine: string;
    frameType: Number;
    icon: string;

    explicitMods?: string[];
    implicitMods?: string[];
    craftedMods?: string[];
    inventoryId?: string;
    socketedItems?: Item[];
    level?: number;
    selected?: Boolean;
    sockets?: JSON;
    textString?: string;
    priceInfo?: Object;
    socketedItemPriceInfo?: Object;
    abyssJewel?: boolean;
    supportGem?: boolean;
    quality?: number
    weaponSwap?: boolean;
    b64?: string;
    

}