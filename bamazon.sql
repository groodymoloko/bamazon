create database bamazon;
use bamazon;
create table products (
	item_id integer(5) not null auto_increment,
    product_name varchar(20),
    department_name varchar(20),
    price decimal(6,2),
    stock_quantity integer(5),
    primary key (item_id)
    );
INSERT INTO products
	(product_name, department_name, price, stock_quantity)
VALUES
	("Chiapet", "HomeGoods", 3.00, 12),
    ("Legos", "Toys", 19.98, 9),
    ("BlueRay", "Electronics", 52.99, 5),
    ("Firestick", "Electronics", 39.99, 3),
    ("Instapot", "HomeGoods", 59.00, 8),
    ("UglySweaters", "Clothes", 2.01, 3),
    ("BlueBlockers", "Clothes", 9.99, 1000),
    ("Botox", "Medical", 199.98, 2),
    ("Depends", "Medical", 14.99, 20),
    ("RubiksCube", "Toys", 8.00, 37);
    
 -- drop database bamazon;   
    
    
	


