import {MongoClient} from "mongodb";

const connectionStr = "mongodb://localhost:27017/";
const client = new MongoClient(connectionStr);
const dbName = "mongoose_exercise";

export default async function connect() {

    try  {
        await client.connect();
        console.log('Successfully connected to MongoDB server');

        const db = client.db(dbName);

        return db; 
    }
    catch(error){
        console.error('Connection failed:', error);
        throw error; // throwing it to the calling function to handle
    }
}
