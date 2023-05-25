const {MongoClient, ExplainVerbosity} = require('mongodb');
const prompt = require('prompt-sync')({sigint: true});
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);
// Add function for checking if vaild email
// Add function for checking if correct phone number
// Delete function user - update active status as false
// Update function user
// Plans collection
// Story collection - add, update, delete, list(report)



async function listDatabases(client){
    databases_list = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databases_list.databases.forEach(db => console.log(` - ${db.name}`));
};

function tryCat(action){
    try{
        action
    }
    catch (e){
        console.error(e);
        process.exit(0);
    }
}

async function openDatabase(client){   
    await client.connect();
    console.log("Database is open");
}

function timeStamp(){
    const date_object = new Date();

    const day = (`0 ${date_object.getDate()}`).slice(-2);
    const month = (`0 ${date_object.getMonth() + 1}`).slice(-1);
    const year = date_object.getFullYear();
    const hours = date_object.getHours();
    const minutes = date_object.getMinutes();
    const seconds = date_object.getSeconds();

    const date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return date
}

async function insertUser(client){ 
    const database_object = client.db("Legacy");
    const collection_object = database_object.collection("users");
    
    console.log("Inserting user");
    console.log("Enter first name");
    let first_name = prompt(">>>");
    console.log("Enter last name");
    let last_name = prompt(">>>");
    console.log("Enter email address")
    let email = prompt(">>>");
    console.log("Enter password");
    let password = prompt(">>>");
    console.log("Enter Phone Number");
    let phone = prompt(">>>");
    let date = timeStamp();
   

    const user_object = { 
        first_name: first_name, 
        last_name: last_name,   
        email: email, 
        password: password, 
        phone_number: phone, 
        avatar: "generic", 
        active: "true", 
        plan_id: "chosen", 
        story_share_link: "generic link", 
        story_shar_link_password: "generic password", 
        created_at: date, 
        updated_at: "null"
    };

    
    let result = await collection_object.insertOne(user_object);

    console.log( `A document was inserted with the _id: ${result.insertedId}`);
}

async function closeDatabase(){
    await client.close();
    console.log("Database closed")
}

async function main() {
  
    let dbopen = true;

    console.log("Hi, this is the db fucntionality for the Legacy App!");
    
    while(dbopen == true){
        console.log("Please choose from our menu:\n a: Open database\n i: Insert User\n q: Close database");
        let choice = prompt(">>>");
        
        if (choice === 'a'){
            
            await openDatabase(client);
            dbopen = true;
        }
        if(choice == 'i'){
            // insert user 
            tryCat(await insertUser(client))
        }
        if(choice == 'l'){
            // list dbs
            tryCat(await listDatabases(client))
        }
        if(choice == 'q'){
            dbopen = false;
            await closeDatabase();
            process.exit(0);
            
        }
    }

        
          
}

main().catch(console.error);
