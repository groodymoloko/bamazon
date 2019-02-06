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
  // begin storefront application 
  printInventory();
});

// presents the for sale items to the user
function printInventory() {
  console.log ("\n");
  console.log ("=================================================");
  console.log (`          ***  WELCOME TO BAMAZON  ***           `);
  console.log ("=================================================");
  console.log ("Here are all the items for sale");
  console.log ("=================================================");
  let inventoryList = "SELECT item_id, product_name, price FROM products";
  connection.query(inventoryList, function(err, res) {
    for (let i = 0; i < res.length; i++) {
      console.log("Item: " + res[i].item_id + " || Name: " + res[i].product_name + " || Price: $" + res[i].price);
    }
    console.log ("=================================================");
    getPurchase();
  });
}

function getPurchase() {
  // grab all information on products from database
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // prompt user for which items and quantity to purchase
    inquirer
      .prompt([
        {
          name: "whatItem",
          type: "input",
          message: "Would item number would you like to buy?"
        },
        {
          name: "howMany",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get info on chosen item
        let chosenItem;
        for (let i = 0; i < results.length; i++) {
          if (results[i].item_id === parseInt(answer.whatItem)) {
            chosenItem = results[i];
          }
        }
        // determine if there is enough stock of item to fulfill purchase request
        if (chosenItem.stock_quantity < parseInt(answer.howMany)) {
          console.log("Sorry, there are not enough units left to fulfill your order.  Try another order.")
          getPurchase();
        } 
        else {
          let newQuantity = chosenItem.stock_quantity - parseInt(answer.howMany);
          let newSales = chosenItem.product_sales + (parseInt(answer.howMany) * chosenItem.price);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              { stock_quantity: newQuantity, product_sales: newSales },
              { item_id: chosenItem.item_id }
            ],
          );
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              { stock_quantity: newQuantity },
              { item_id: chosenItem.item_id }
            ],
          );
          console.log ("=================================================");
          console.log("Your total cost is $" + (chosenItem.price * answer.howMany));
          console.log ("=================================================");
          connection.end();
        }

      });
  });
}
