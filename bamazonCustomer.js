//Require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");

//Create a connection to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Vanilla1",
    database: "bamazon_db"
  })

  function start() {
    connection.query("SELECT * FROM Products", function(err, res){
        if(err) throw err;

        
        console.log("----------------------------------------------------------------------------------------------------")
  
        for( var i = 0; i < res.lenght; i++) {
            console.log("Id " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quanity);
            console.log("----------------------------------------------------------------------------------------------------")
        }

        console.log(" ");
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "What is the id of the prodduct that you'd like to purchase?"
            }
        ])

       
    })

}
start();
