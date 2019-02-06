const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
let connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // let manager choose an action 
  console.log ("\n");
  console.log ("=================================================");
  console.log (`      ***  WELCOME TO BAMAZON MANAGER  ***       `);
  console.log ("=================================================");
  console.log ("\n");
  menuOptions();
});

// menu of options for the manager to select
function menuOptions() {
  inquirer
  .prompt({
    name: "action",
    type: "rawlist",
    message: "Please select one of the following options",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product",
      "Exit"
    ]
  })
  .then(function(answer) {
    switch (answer.action) {
    case "View Products for Sale":
      viewProducts();
      break;

    case "View Low Inventory":
      lowInventory();
      break;

    case "Add to Inventory":
      addInventory();
      break;

    case "Add New Product":
      addProduct();
      break;
    
    case "Exit":
      connection.end();
    }
  });
}

function viewProducts() {
  // grab all information on products from database
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
        console.log("Item: " + results[i].item_id + " || Name: " + results[i].product_name + " || Price: $" + results[i].price + " || In Stock: " + results[i].stock_quantity);
    }
    console.log ("=================================================");
    menuOptions();
  });
}

function lowInventory() {
    // grab inventory information on products from database
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
          if (results[i].stock_quantity < 5) {
            console.log("Item: " + results[i].item_id + " || Name: " + results[i].product_name + " || Price: $" + results[i].price + " || In Stock: " + results[i].stock_quantity);   
          } 
      }
      console.log ("=================================================");
      menuOptions();
    });
}

function addInventory() {
    // grab inventory information on products from database
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
            {
                name: "itemChoice",
                type: "input",
                message: "Enter the item ID number of the product you wish to add: "
            },
            {
                name: "howMany",
                type: "input",
                message: "Please enter the quantity you want to add: "
            }
        ])
        .then(function(answer) {
            let chosenItem;
            for (let i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.itemChoice)) {
                    chosenItem = results[i];
                    chosenItem.stock_quantity += parseInt(answer.howMany);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log(chosenItem.product_name + " updated successfully.  Current count is: " + chosenItem.stock_quantity);
                            menuOptions();
                        } 
                    );
                }
            }
        });
    });
}

function addProduct() {
    // grab inventory information on products from database
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
            {
                name: "new_name",
                type: "input",
                message: "Please enter the product name you would like to add: "
            },
            {
                name: "new_dept",
                type: "input",
                message: "Please enter the department for the new product: "
            },
            {
                name: "new_price",
                type: "input",
                message: "Please enter the price of your new item: "
            },
            {
                name: "new_quantity",
                type: "input",
                message: "Please enter quantity of the new item you are adding: "
            }
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO products SET ?",
                    {
                        product_name: answer.new_name,
                        department_name: answer.new_dept,
                        price: answer.new_price,
                        stock_quantity: answer.new_quantity
                    },
                    function(error) {
                        if (error) throw err;
                        console.log("New item entered successfully.");
                        menuOptions();
                    } 
            );
        });
    });
}