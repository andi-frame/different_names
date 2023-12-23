import { Canister, query, text, update, Void, StableBTreeMap, nat64, bool, Vec, Record } from 'azle';
import { v4 as uuidv4 } from 'uuid';


type Data = {
    owner: text,
    name: text,
}

const nameStorage = StableBTreeMap<text, text>(0);

function findInMap(map, val: text): bool{
    for (let [k, v] of map) {
      if (v === val) { 
        return true; 
      }
    }  
    return false;
};


export default Canister({
    getNames : query([text], text, (owner) => {
        return "tes" + nameStorage.get(owner);
    }),
    addNames : update([text, text], text, (owner, name) => {
        if(findInMap(nameStorage, name)){
            return "Name already exist, please insert another name";
        }
        nameStorage.insert(name, owner);
        return name + " entered successfully";
    })
});

// This code wants to store all names especially product names. This code will check whether the name is already exist or not. This code also stores the owner of the name inserted.
// Hope in the future there will be some adjustment and update about this code