//Require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");
var pw = require("./pw.js");
//Create a connection to mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: pw.pw,
    database: "bamazon_db"
  });
//Create a connection to database
connection.connect(function(err) {
    if (err) throw err;
    console.log("\n--------------------Welocome to Bamazon--------------------\n")
//Start
    start();
});

function start() {
//Ask the customer what they'd like to do
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            choices: ["View items for sale", "Leave the store"],
            message: "What would you like to do?"
        }
    ]).then(function(action) {
        if (action.action === "View items for sale") {
            viewItems();
        } else if (action.action === "Leave the store") {
            exit();
        }
    });
}
//   function start() {
//     connection.query("SELECT * FROM Products", function(err, res){
//         if(err) throw err;

        
//         console.log("----------------------------------------------------------------------------------------------------")
  
//         for( var i = 0; i < res.lenght; i++) {
//             console.log("Id " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
//             console.log("----------------------------------------------------------------------------------------------------")
//         }

//         console.log(" ");
//         inquirer.prompt([
//             {
//                 type: "input",
//                 name: "id",
//                 message: "What is the id of the prodduct that you'd like to purchase?"
//             }
//         ])

       
//     })

// }
// start();
