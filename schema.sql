DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT (4) NOT NULL AUTO_INCREMENT,
product_name VARCHAR (100) NOT NULL,
department_name VARCHAR (100) NOT NUll,
price DECIMAL (10,2) NOT NULL,
stock_quanity INT (50) NOT NUll,
product_sales DECIMAL(10,2) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quanity, product_sales)
VALUES ("Rucksack", "Outdoors", 98.95, 11, 100),
("Crock Pot", "Kitchen", 49.95, 26, 145),
("Power Drill", "Tools", 84.95, 17, 85),
("Winter Coat", "Clothing", 109.95, 8, 42),
("Diamond Necklace", "Jewlery", 4995.95, 3, 17),
("Tent", "Outdoors", 135.95, 6, 253),
("Bread Maker", "Kitchen", 89.95, 11, 354),
("Hammer", "Tools", 29.95, 4, 196),
("Sandals", "Clothing", 4.95, 17, 745),
("Gold Bracelet", "Jewlery", 995.95, 6, 72);

SELECT * FROM products;


