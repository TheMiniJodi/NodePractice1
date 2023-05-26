const {MongoClient, ExplainVerbosity} = require('mongodb');
const prompt = require('prompt-sync')({sigint: true});
const email_validator = require('email-validator');
const {phone} = require('phone');
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);
// Add function for checking if vaild email - done
// Add function for checking if correct phone number -done
// Delete function user - update active status as false
// Update function user
// Plans collection
// Story collection - add, update, delete, list(report)

function choosePlan(){
    console.log("Please select a plan:\n b: Basic\n p: Permium");
    let plan = prompt(">>>");
    while(plan !== 'b' && plan !== 'p'){
        console.log("Please enter b or p ");
        plan = prompt(">>>");
    }
    return plan;
}

async function listDatabases(client){
    try{
        databases_list = await client.db().admin().listDatabases();
    
        console.log("Databases:");
        databases_list.databases.forEach(db => console.log(` - ${db.name}`));
    }catch(e){
        console.log("Something went wrong");
        console.error(e);
    }
};


async function openDatabase(client){  
    try{ 
        await client.connect();
        console.log("Database is open");
    }catch(e){
        console.log("Sorry could not open database....exiting program");
        console.error(e);
        process.exit(0);
    }
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
    while (!email_validator.validate(email)){
        console.log("Invalid email\n Please enter a vaild email");
        email = prompt(">>>")
    }
    console.log("Enter password");
    let password = prompt(">>>");

    console.log("Enter Phone Number");
    let phone_number = prompt(">>>");
    while (!phone(phone_number).isValid){
        console.log("Invaild phone number\n Please enter vaild phone number");
        phone_number =  prompt(">>>")
    }

    const date = timeStamp();

    const plan = choosePlan();
   

    const user_object = { 
        first_name: first_name, 
        last_name: last_name,   
        email: email, 
        password: password, 
        phone_number: phone_number, 
        avatar: "generic", 
        active: "true", 
        plan_id: plan, 
        story_share_link: "generic link", 
        story_shar_link_password: "generic password", 
        created_at: date, 
        updated_at: "null"
    };
    try{
        let result = await collection_object.insertOne(user_object);
        console.log( `A document was inserted with the _id: ${result.insertedId}`);
    }catch(e){
        console.log("Could not add new user");
        console.error(e);
    }
}

async function closeDatabase(){
    try{
        await client.close();
        console.log("Database closed");
    }catch(e){
        console.log("Could not close database");
        console.error(e);
    }  
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
            await insertUser(client);
        }
        if(choice == 'l'){
            // list dbs
            await listDatabases(client);
        }
        if(choice == 'q'){
            dbopen = false;
            await closeDatabase();
            process.exit(0);
            
        }
    }

        
          
}

main().catch(console.error);
