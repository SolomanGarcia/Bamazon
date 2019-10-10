
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTableNPM = require("console.table");
var pw = require("./pw.js");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: pw.pw,
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\n--------------------Welocome to Bamazon--------------------\n")
    start();
});

function start() {
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

function viewItems() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, results) {
        if (err) throw err; 
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
                name: "quantity",
                message: "How many would you like to buy?",
                validate: function (value) {
                    if (value > 0 && isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (transaction) {
            var itemQuantity;
            var itemPrice;
            var itemName;
            var productSales;


            for (var i = 0; i < results.length; i++) {
                if (parseInt(transaction.id) === results[i].item_id) {
                    itemQuantity = results[i].stock_quantity;
                    itemPrice = results[i].price;
                    itemName = results[i].product_name;
                    productSales = results[i].product_sales;
                }
            }
             
            if (parseInt(transaction.quantity) > itemQuantity) {
                console.log("\nInsufficient inventory for your requested quantity. We have "
                    + itemQuantity + " in stock. Try again.\n");
                start();
            } else if (parseInt(transaction.quantity) <= itemQuantity) {
                console.log("\nCongrats! You successfully purchased " + transaction.quantity
                    + " of " + itemName + ".");
                lowerQuantity(transaction.id, transaction.quantity, itemQuantity, itemPrice);
                salesRevenue(transaction.id, transaction.quantity, productSales, itemPrice);
            }
        })
    })

}
function consoleTable(results) {
    var values = [];
    for (var i = 0; i < results.length; i++) {
        var resultObject = {
            ID: results[i].item_id,
            Item: results[i].product_name,
            Price: "$" + results[i].price,
            Department: results[i].department_name
        };
        values.push(resultObject);
    }
    console.table("\nItems for Sale", values);
}
function lowerQuantity(item, purchaseQuantity, stockQuantity, price) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stockQuantity - parseInt(purchaseQuantity)
            },
            {
                item_id: parseInt(item)
            }
        ],
        
        function (err, response) {
            if (err) throw err;
        });
}
function salesRevenue(item, purchaseQuantity, productSales, price) {
    var customerCost = parseInt(purchaseQuantity) * price;
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                product_sales: productSales + customerCost
            },
            {
                item_id: parseInt(item)
            }
        ],
        function (err, response) {
            if (err) throw err;
            console.log("The total price is $" + customerCost.toFixed(2)
                + ". Thanks for you purchase!\n");
            start();
        });
}

function exit() {
    console.log("\nThanks for stopping by! Have a good day.");
    connection.end();
}






