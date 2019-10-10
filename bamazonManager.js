var inquirer = require("inquirer");
var mysql = require("mysql");
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
    console.log("\n--------------------Welocome to Bamazon Manager--------------------\n")
    //Start
    start();
});

function start() {
	inquirer.prompt([
		 {
		 	name: "action",
		 	type: "list",
		 	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", 
		 		"Add New Product", "Exit"],
		 	message: "Please select what you would like to do."
		 }
	]).then(function(answer) {
		if (answer.action === "View Products for Sale") {
			viewProducts();
		} else if (answer.action === "View Low Inventory") {
			viewLowInventory();
		} else if (answer.action === "Add to Inventory") {
			addToInventory();
		} else if (answer.action === "Add New Product") {
			addNewProduct();
		} else if (answer.action === "Exit") {
			exit();
		}
	})
}

function viewProducts() {
	var query = "SELECT * FROM products";
	connection.query(query, function(err, results) {
		if (err) throw err;
		consoleTable("\nAll Products For Sale", results);
		start();
	});
}

function viewLowInventory() {
	var query = "SELECT * FROM products WHERE stock_quantity<5";
	connection.query(query, function(err, results) {
		if (err) throw err;
		consoleTable("\nLow Product Inventory Data", results);
		start();
	});
}

function addToInventory() {
	connection.query("SELECT * FROM products", function (err, results) {
		if (err) throw err;
		consoleTable("\nCurrent Inventory Data", results);
		inquirer.prompt([
			{
				name: "id",
				message: "Input the item ID to increase inventory on.",
				validate: function(value) {
					if (isNaN(value) === false && value > 0 && value <= results.length) {
						return true;
					}
					return false;
				}
			},
			{
				name: "amount",
				message: "Input the amount to increase inventory by.",
				validate: function(value) {
					if (isNaN(value) === false && value > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answer) {
			var itemQuantity;
			 for (var i = 0; i < results.length; i++) {
				if (parseInt(answer.id) === results[i].item_id) {
					itemQuantity = results[i].stock_quantity;
				}
			}
			increaseQuantity(answer.id, itemQuantity, answer.amount);
		});
	});
}

function increaseQuantity(item, stockQuantity, addQuantity) {
	connection.query(
		"UPDATE products SET ? WHERE ?", 
		[
			{
				stock_quantity: stockQuantity + parseInt(addQuantity)
			}, 
			{
				item_id: parseInt(item)
			}
		], 
		function(err, results) {
			if (err) throw err;
			console.log("\nInventory successfully increased.\n");
			start();
	});
}

function addNewProduct() {
	connection.query("SELECT * FROM departments", function (err, results) {
		inquirer.prompt([
			{
				name: "item",
				message: "Input new item to add."
			},
			{
				name: "department",
				type: "list",
				choices: function() {
					var deptArray = [];
					for (var i = 0; i < results.length; i++) {
						deptArray.push(results[i].department_name);
					}
					
					return deptArray;
				},
				message: "Which department does this item belong in?"
			},
			{
				name: "price",
				message: "How much does this item cost?",
				validate: function(value) {
					if (value >= 0 && isNaN(value) === false) {
						return true;
					}
					return false;
				}
			},
			{
				name: "inventory",
				message: "How much inventory do we have?",
				validate: function(value) {
					if (value > 0 && isNaN(value) === false) {
						return true;
					}
					return false;
				}			
			}
		]).then(function(newItem) {
			addItemToDb(newItem.item, newItem.department, 
				parseFloat(newItem.price).toFixed(2), parseInt(newItem.inventory));
		});
	});
}

function addItemToDb(item, department, price, quantity) {
	connection.query(
		"INSERT INTO products SET ?", 
		{
			product_name: item,
			department_name: department,
			price: price,
			stock_quantity: quantity
		},
		function(err, results) {
			if (err) throw err;
			console.log("\nNew product successfully added.\n");
			start();
	});
}


function consoleTable(title, results) {
	var values = [];
	for (var i = 0; i < results.length; i++) {
		var resultObject = {
			ID: results[i].item_id,
			Item: results[i].product_name,
			Price: "$" + results[i].price,
			Inventory: results[i].stock_quantity + " units"
		};
		values.push(resultObject);
	}
	console.table(title, values);
}

function exit() {
	console.log("\nGet back to work!.");
	connection.end();
}