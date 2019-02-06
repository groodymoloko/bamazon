# bamazon
https://github.com/groodymoloko/bamazon.git


A simple storefront Node command line application that allows the following operations:
* Customers can list inventory and purchase items.
* Managers can view products including low inventory items, add current products, and create new products.
* Supervisors can view sales and profit by department and create new departments.

## NPM Modules & Files
The following NPM modules are required by the application:
* mysql
* inquirer
* console.table

The required files all exist in a flat directory:
* bamazon.sql - MySQL code required for database backend (one database and two tables).
* bamazonCustomer.js - customer operations
* bamazonManager.js - manager operations
* bamazonSupervisor.js - supervisor operations

## Code
Analyse the three .js files for code specifics.  The basic flow of all three parts of the application is as follows:
1) Connect to MySQL database
2) Offter menu choices for user using inquirer
3) Accept user choice and launch appropriate switch case function
4) Perform correct function (purchase, add inventory, display sales and profit, etc.)

## Examples (run from Git Bash or other command line utility)
* $ node bamazonCustomer.js
* $ node bamazonManager.js
* $ node bamazonSupervisor.js

The following screenshots show the output for some examples of the three storefront modules:

![Application Examples](/screenshots/customerpurchase.jpg?raw=true)

![Application Examples](/screenshots/managerlist.jpg?raw=true)
