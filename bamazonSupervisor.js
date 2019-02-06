const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
  console.log (`      ***  WELCOME TO BAMAZON SUPERVISOR  ***       `);
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
      "View Product Sales by Department",
      "Create New Department",
      "Exit"
    ]
  })
  .then(function(answer) {
    switch (answer.action) {
    case "View Product Sales by Department":
      viewSales();
      break;

    case "Create New Department":
      newDept();
      break;
    
    case "Exit":
      connection.end();
    }
  });
}

function viewSales() {
    
    let salesQuery = 'SELECT departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) AS product_sales, sum(products.product_sales) - departments.over_head_costs AS total_profit ';
      salesQuery += 'FROM departments ';
      salesQuery += 'INNER JOIN products ON departments.department_name = products.department_name ';
      salesQuery += 'GROUP BY departments.department_id';
      
    connection.query(salesQuery, function(err, results) {
      if (err) throw err;
      console.table(results);
      for (let i = 0; i < results.length; i++) {
          let deptProfit = results[i].product_sales - results[i].over_head_costs;
      }
      console.log ("=================================================");
      menuOptions();
    });
}

function newDept() {
    // grab inventory information on products from database
    connection.query("SELECT * FROM departments", function(err, results) {
      if (err) throw err;
      inquirer
        .prompt([
            {
                name: "new_name",
                type: "input",
                message: "Please enter the department you would like to add: "
            },
            {
                name: "overhead",
                type: "input",
                message: "Please enter the overhead costs for the new department: "
            }
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                    {
                        department_name: answer.new_name,
                        over_head_costs: answer.overhead,
                    },
                    function(error) {
                        if (error) throw err;
                        console.log("New department entered successfully.");
                        menuOptions();
                    } 
            );
        });
    });
}