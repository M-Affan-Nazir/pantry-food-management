import { openDatabase, SQLiteDatabase, enablePromise } from "react-native-sqlite-storage"



enablePromise(true)

let tableName = "itemTable"
type itemTypeIn = {
    name : string,
    expiry : number,
    factor: string,
    quantity : number,
    price : number,
}

type itemTypeOut = {
    id : number,
    name : string,
    expiry : number,
    factor: string,
    quantity : number,
    price : number,
    createdAt : number
}

export const getDBConnection = async () => {
    return openDatabase({name: 'items', location: 'default'});
};

export const createTable = async (db : SQLiteDatabase) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, expiry INTEGER NOT NULL, factor TEXT NOT NULL, quantity INTEGER NOT NULL, price INTEGER, created_at INTEGER DEFAULT (strftime('%s', 'now')));`
    await db.executeSql(query)
}

export const getItems = async(db : SQLiteDatabase) => {

    try{
        let listItems : itemTypeOut[] = []
        const query =  `SELECT * FROM ${tableName}`
        const result = await db.executeSql(query)
        for (let i = 0; i<result[0].rows.length; i++){
            listItems.push(result[0].rows.item(i))
        }
        return listItems
    }
    catch(e){
        console.warn("Failed to get Items: " + e)
        return []
    }

}

export const addItem =  async (db : SQLiteDatabase, itmx : itemTypeIn[]) => {
    
    const query = `INSERT INTO ${tableName} (name, expiry, factor, quantity, price) VALUES (?,?,?,?,?) `
    for(let i = 0; i<itmx.length; i++){
        try{
            const result = await db.executeSql(query, [itmx[i].name, itmx[i].expiry, , itmx[i].factor, itmx[i].quantity, itmx[i].price]) 
            console.warn("Successfull Added Products")
        }
        catch(e){
            console.log(e)
        }
             
    }
      
}


export const deleteItem = async (db: SQLiteDatabase, itemID : number ) => {
    const query = `DELETE from ${tableName} WHERE id = ?`
    await db.executeSql(query, [itemID])
}