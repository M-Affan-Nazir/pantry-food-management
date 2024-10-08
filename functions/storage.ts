import { SwipeDirectionTypes } from "react-native-screens"
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
    created_at : number
}

export const getDBConnection = async () => {
    try {
        const db = await openDatabase({ name: 'items', location: 'default' });
        console.log("Database connection established.");
        return db;
    } catch (error) {
        console.error("Failed to connect to database:", error);
        throw error;  // Ensure the error is not silently ignored
    }
};

export const createTable = async (db : SQLiteDatabase) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName}(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, expiry INTEGER NOT NULL, factor TEXT NOT NULL, quantity INTEGER NOT NULL, price INTEGER, created_at INTEGER DEFAULT (strftime('%s', 'now')));`
    const query2 = `CREATE TABLE IF NOT EXISTS utilizedTable(id INTEGER, utilized INTEGER)`
    await db.executeSql(query)
    await db.executeSql(query2)
    await addInitial(db)
}

export const getItems = async(db : SQLiteDatabase) => {

    try{
        let listItems : itemTypeOut[] = []
        const query =  `SELECT * FROM ${tableName}`
        const result = await db.executeSql(query)
        for (let i = 0; i<result[0].rows.length; i++){
            listItems.push(result[0].rows.item(i))
        }
        console.warn("Items Retrieved")
        return listItems
    }
    catch(e){
        console.warn("Failed to get Items: " + e)
        return []
    }

}

export const addItem =  async (db : SQLiteDatabase, itmx : itemTypeIn[]) => {
    
    const query = `INSERT INTO ${tableName} (name, expiry, factor, quantity, price) VALUES (?,?,?,?,?)`
    for(let i = 0; i<itmx.length; i++){
        try{
            const result = await db.executeSql(query, [itmx[i].name, itmx[i].expiry, itmx[i].factor, itmx[i].quantity, itmx[i].price]) 
            console.warn("Successfull Added Products")
        }
        catch(e){
            console.warn(e)
        }
             
    }
      
}


export const updateItem = async (db: SQLiteDatabase, itemID : number, quantity:number ) => {

    console.warn("Updating...")
    const query2 = `SELECT quantity FROM ${tableName} WHERE id = ?`
    let [results]  = await db.executeSql(query2, [itemID])
    let q = results.rows.item(0).quantity;
    console.warn(q)
    try{
        if(q-quantity <= 1){
            const query = `DELETE from ${tableName} WHERE id = ?`
            await db.executeSql(query, [itemID])
            console.warn("Items Deleted")
        }
        else{
            const query = `UPDATE ${tableName} SET quantity = ? WHERE id = ?`;
            await db.executeSql(query, [q-quantity, itemID]);
            console.warn("Item Updated")
        }  
    }
    catch(e){
        console.warn("Error Updating: " + e)
    }
   
    
}

export const getUtilized = async (db : SQLiteDatabase) => {
    try{
        const query =  `SELECT * FROM utilizedTable`
        const result = await db.executeSql(query)
        const firstRow = result[0].rows.item(0)
        const util = firstRow.utilized
        return util
    }
    catch(e){
        console.warn(e)
    }
}

export const updateUtilized = async (db: SQLiteDatabase, quantity:number) => {
    try{
        const already : number = await getUtilized(db)
        const query = `UPDATE utilizedTable SET utilized = ? WHERE id = 786`;
        await db.executeSql(query, [quantity+already]);
    }
    catch(e){
        console.warn(e)
    }
}

export const addInitial = async (db: SQLiteDatabase) => {
    try{
        const query = `INSERT INTO utilizedTable (id, utilized) VALUES (786, 0)`
        await db.executeSql(query)
    }
    catch(e){
        return
    }
}

export const reset = async (db: SQLiteDatabase, expiredArray : itemTypeOut[]) => {
    const query = `UPDATE utilizedTable SET utilized = ? WHERE id = 786`;
    await db.executeSql(query, [0]);
    
    console.warn("resetting...")
    const ids = expiredArray.map(item => item.id);
   for(let i = 0; i<ids.length; i++){
        const query2 = `DELETE from ${tableName} WHERE id = ?`
        await db.executeSql(query2, [ids[i]])
   }
}