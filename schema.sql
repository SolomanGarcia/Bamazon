DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT (4) NOT NULL AUTO_INCREMENT,
product_name VARCHAR (100) NOT NULL,
department_name VARCHAR (100) NOT NUll,
price DECIMAL (10,2) NOT NULL,
stock_quanity INT (50) NOT NUll,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quanity)
VALUES ("Rucksack", "Outdoors", 98.95, 11),
("Crock Pot", "Kitchen", 49.95, 26),
("Power Drill", "Tools", 84.95, 17),
("Winter Coat", "Clothing", 109.95, 8),
("Diamond Necklace", "Jewlery", 4995.95, 3),
("Tent", "Outdoors", 135.95, 6),
("Bread Maker", "Kitchen", 89.95, 11),
("Hammer", "Tools", 29.95, 4),
("Sandals", "Clothing", 4.95, 17),
("Gold Bracelet", "Jewlery", 995.95, 6);

SELECT * FROM products;


