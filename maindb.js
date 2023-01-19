const prompt = require("prompt-sync")();

// Connect Mongodb
// var MongoClient = require("mongodb").MongoClient;
const { MongoClient } = require("mongodb");
// var url = "mongodb://localhost:27017/";
var url =
  "mongodb+srv://nancyokeke:<nancyokeke>@cluster0.6tjlwko.mongodb.net/?retryWrites=true&w=majority";

/**
 * The Mongo Client you will use to interact with your database
 * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
 * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
 * pass option { useUnifiedTopology: true } to the MongoClient constructor.
 * const client =  new MongoClient(uri, {useUnifiedTopology: true})
 */
const client = new MongoClient(url);

// The Logic Starts Here
console.log(">>>>>>>>>>");
console.log("Welcome to Your Todo App...");
console.log(">>>>>>>>>>");

let keepAppRunning = prompt("Press 'M' to start, press  'Q'  to quit >>>> ");

let todos = true;
let choice;

// Create Todos
const createTodos = async (title, myTodo, priority) => {
  try {
    await client.connect();
    console.log("database connected");
    const newTodo = {
      title: title,
      note: myTodo,
      priority: priority,
    };
    const result = await client
      .db("Todos")
      .collection("Notes")
      .insertOne(newTodo);
    await client.close();
    console.log(`New Todo created: ${result}`);
  } catch (error) {
    console.log(error.message);
  }
  // await MongoClient.connect(url, function (err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("Todo");
  //   var myTodos = {
  //     title: title,
  //     note: myTodo,
  //     priority: priority,
  //   };
  //     dbo.collection("Notes").insertOne(myTodos, function (err, res) {
  //       if (err) throw err;
  //       console.log("1 Todo inserted");
  //       db.close();
  //     });
  //   });
};

// Read Todos
const readTodos = async () => {
  Promise.all(
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("Todo");
      dbo.collection("Notes").find({}, function (err, result) {
        if (err) throw err;
        console.log("Todos");
        console.log(result);
      });
    })
  );
};

// Update Todos
const updateTodos = async (todoId, title, myTodo, priority) => {
  await MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Todos");
    var myquery = {
      _id: todoId,
    };
    var newvalues = {
      $set: {
        title: title,
        note: myTodo,
        priority: priority,
      },
    };
    dbo.collection("Notes").updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
};

// Delete Todos
const deleteTodos = async (todoId) => {
  await MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("Todos");
    var myquery = { _id: todoId };
    try {
      dbo.collection("Notes").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
      });
    } catch (error) {
      console.log("id does not exist");
    }
  });
};
// While Statements

while (todos === true) {
  // Convert the string inside the KeepAppRunning variable too lowerCase

  keepAppRunning.toLowerCase();

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    //Create Database
    console.log("Database created!");
    var dbo = db.db("Todo");

    // Create Collection
    dbo.createCollection("Notes", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
  // if keepAppRunning equals "q", Exit the console application
  if (keepAppRunning === "q") {
    todos = false;
    console.log(">>>>>>>>>>");
    console.log("Thank you for visiting us,lol");
    console.log(">>>>>>>>>>");
    break;
  }

  choice = prompt(
    " Choose from the following options:\n C. Create Todo \n R. Read Todo \n U. Update Todo \n D. Delete Todo \n Q. Exit Application \n\n"
  );

  choice = choice.toLowerCase();

  if (choice === "q") {
    todos = false;
    console.log(">>>>>>>>>>");
    console.log("");
    console.log(">>>>>>>>>>");
    console.log("Thank you for visiting us,lol");
    console.log("");
    break;
  }
  // CreateTodos Logic

  // Take User Input

  if (choice === "c") {
    let title = prompt("What is the title of your todo?");
    let myTodo = prompt("What is your Todo?");
    let priority = prompt("What is the priority of Your Todo?");
    console.log("");
    console.log(">>>>>>>>>>");
    console.log("");
    try {
      console.log("");
      console.log("");
      createTodos(title, myTodo, priority);
      console.log("Todos successfully created");
    } catch (error) {
      console.log(error.message);
    }

    // ReadTods Logic
  } else if (choice === "r") {
    console.log("");
    console.log("");
    console.log(">>>>>>>>>>");
    try {
      console.log("");
      console.log(readTodos());
    } catch (error) {
      console.log(error.message);
    }

    // Prompt the User for Input

    // DeleteTodos Logic
  } else if (choice === "d") {
    let todoId = prompt("What is the Id of the Todo you want to delete? ");
    console.log("");
    console.log("");
    console.log(">>>>>>>>>>");
    try {
      console.log("");
      deleteTodos(todoId);
      console.log("Todo successfully deleted");
    } catch (error) {
      console.log(error.message);
    }

    // Update Todo Logic
  } else if (choice == "u") {
    let todoId = prompt("What is the id of the item you want to update?");
    let title = prompt("Enter a new Title ");
    let myTodo = prompt("Enter a new Todo ");
    let priority = prompt("Enter an updated Priority");
    console.log("");
    console.log("");
    console.log(">>>>>>>>>>");

    // prompt ther Users for Inputs

    try {
      console.log("");
      console.log("");
      updateTodos(todoId, title, myTodo, priority);
      console.log("Todos successfully Updated");
    } catch (error) {
      console.log(error.message);
    }
  }
}
