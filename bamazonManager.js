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