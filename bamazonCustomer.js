//Require mysql and inquirer
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");
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
connection.connect(function (err) {
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
    ]).then(function (action) {
        if (action.action === "View items for sale") {
            viewItems();
        } else if (action.action === "Leave the store") {
            exit();
        }
    });
}
// View items function
function viewItems() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err;
        // build the table 
        consoleTable(results);
        inquirer.prompt([
            {
                name: "id",
                message: "Enter the ID of the product you want to purchase",
                validate: function (value) {
                    if (value > 0 && isNaN(value) === false && value <= results.length) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quanity",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (value > 0 && isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (transaction) {
            var itemQuanity;
            var itemPrice;
            var itemName;
            // var departmentName;

            for (var i = 0; i < results.length; i++) {
                if (parseInt(transaction.id) === results[i].item_id) {
                    itemQuanity = results[i].stock_quanity;
                    itemPrice = results[i].price;
                    itemName = results[i].product_name;
                    // departmentName = results[i].department_name;
                }
            }
            //If insuffcient stock 
            if (parseInt(transaction.qty) > itemQuanity) {
                console.log("\nInsufficient inventory for your requested quantity. We have "
                    + itemQuanity + " in stock. Try again.\n");
                stock();
            } else if (parseInt(transaction.qty) <= itemQuanity) {
                console.log("\nCongrats! You successfully purchased " + transaction.qty
                    + " of " + itemName + ".");
                lowerQty(transaction.id, transaction.qty, itemQuanity, itemPrice);
            }
            })
    })
}

    function consoleTable(results) {
        // create empty values array
        var values = [];
        // loop through all results
        for (var i = 0; i < results.length; i++) {
            // create resultObject for each iteration. properties of object will be column
            // headings in the console table
            var resultObject = {
                ID: results[i].item_id,
                Item: results[i].product_name,
                Price: "$" + results[i].price,
                Department: results[i].department_name
            };
            // push result object to values array
            values.push(resultObject);
        }
        // create table with title items for sale with the values array
        console.table("\nItems for Sale", values);
    }

});
}


