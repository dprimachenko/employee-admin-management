//var orm = require("./config/orm.js");
const inquirer = require('inquirer');
let fs = require("fs");
const connection = require("./config/connection");

let roles;
let employeees;
let departments;
let managers;
function viewEmp() {
	let queryString = "SELECT * FROM hw_schema.employee;";
	connection.query(queryString, function(err, result) {
      	if (err) throw err;
      	console.table(result);
      	start();
    });
};

function viewEmpMan() {
	let queryString = "SELECT A.first_name,A.last_name, B.first_name as manager_first_name, B.last_name as manager_last_name FROM hw_schema.employee A, hw_schema.employee B  where A.manager_id = B.id order by manager_first_name;";
	connection.query(queryString, function(err, result) {
      	if (err) throw err;
      	console.table(result);
      	start();
    });
};

function viewEmpDep() {
	let queryString = "SELECT first_name, last_name, title, name FROM hw_schema.employee, hw_schema.role, hw_schema.department where employee.role_id = role.id and role.department_id = department.id order by name;";
	connection.query(queryString, function(err, result) {
      	if (err) throw err;
      	console.table(result);
      	start();
    });
};

function viewRl() {
	let queryString = "SELECT * FROM hw_schema.role;";
	connection.query(queryString, function(err, result) {
      	if (err) throw err;
      	console.table(result);
      	start();
      });
};

function viewDep() {
	let queryString = "SELECT * FROM hw_schema.department;";
	connection.query(queryString, function(err, result) {
      	if (err) throw err;
      	console.table(result);
      	start();
      });
};

function storeEmployees() {
	return new Promise((resolve,reject) =>{
    	connection.query("SELECT CONCAT(first_name, ' ', last_name) as name, id as value FROM hw_schema.employee;",function(err, result) {
      		if (err) reject(err);
    		return resolve(result);
      	});
    });
};

function storeDepartments() {
	return new Promise((resolve,reject) =>{
    	connection.query("SELECT name, id as value FROM hw_schema.department;",function(err, result) {
      		if (err) reject(err);
    		return resolve(result);
      	});
    });
};

function storeRoles() {
	return new Promise((resolve,reject) =>{
    	connection.query(`SELECT title as name, id as value FROM hw_schema.role;`,function(err, result) {
      		if (err) reject(err);
    		return resolve(result);
      	});
    });
};

function storeManagers() {
	return new Promise((resolve,reject) =>{
    	query(`SELECT CONCAT_WS(' ',B.first_name,B.last_name) as name, B.id as value FROM hw_schema.employee A, hw_schema.employee B  where A.manager_id = B.id;`,function(err, result) {
      		if (err) reject(err);
    		return resolve(result);
      	});
    });
};

function delEmp(id) {
	let queryString="DELETE FROM `hw_schema`.`employee` WHERE (`id` = ?);";
	connection.query(queryString,[id], function(err, result) {
      	if (err) throw err;
      	console.log("Successfully removed Employee!");
      	start();
    });
};

function delRl(id) {
	let queryString="DELETE FROM `hw_schema`.`role` WHERE (`id` = ?);";
	connection.query(queryString,[id], function(err, result) {
      	if (err) throw err;
      	console.log("Successfully removed Role!");
      	start();
    });
};

function delDep(id) {
	let queryString="DELETE FROM `hw_schema`.`department` WHERE (`id` = ?);";
	connection.query(queryString,[id], function(err, result) {
      	if (err) throw err;
      	console.log("Successfully removed Department!");
      	start();
    });
};

function insertEmp(fName, lName, sRole, sManager) {
	let queryString="INSERT INTO `hw_schema`.`employee` (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES (?, ?, ?, ?);";
	connection.query(queryString,[fName, lName, sRole, sManager], function(err, result) {
      	if (err) throw err;
      	console.log("Successfully added Employee!");
      	start();
    });
};

function insertRl(title,salary,department) {
	let queryString="INSERT INTO `hw_schema`.`role` (`title`, `salary`, `department_id`) VALUES (?, ?, ?);";
	connection.query(queryString,[title,salary,department], function(err, result) {
      	if (err) throw err;
      	console.log("Successfully added Role!");
      	start();
    });
};

function insertDep(name) {
	let queryString="INSERT INTO `hw_schema`.`department` (`name`) VALUES (?);";
	connection.query(queryString,[name], function(err, result) {
      	if (err) throw err;
      	console.log("Successfully added Department!");
      	start();
    });
};	
 async function start() {
		 let options = await inquirer.prompt([{
	  		type: 'list',
	  		name:'whatToDo',
	  		message:"What would you like to do?",
	  		choices: ["View All Employees","View All Employees By Manager","View All Employees By Department","Add Employee","Remove Employee",
	  		"View All Roles","Add Role","Remove Role","View All Departments","Add Department",
	  		"Remove Department","Quit"],
	  	}]);
	  		switch(options.whatToDo) {
	  			case "View All Employees":
	  				viewEmp();
	  				break;

	  			case "View All Employees By Manager":
	  				viewEmpMan();
	  				break;

	  			case "View All Employees By Department":
	  				viewEmpDep();
	  				break;

	  			case "Add Employee":
	  				addEmployee();
	  				break;

	  			case "Remove Employee":
	  				removeEmployee();
	  				break;

	  			case "View All Roles":
	  				viewRl();
	  				break;

	  			case "Add Role":
	  				addRole();
	  				break;

	  			case "Remove Role":
	  				remRole();
	  				break;

	  			case "View All Departments":
	  				viewDep();
	  				break;

	  			case "Add Department":
	  				addDep();
	  				break;

	  			case "Remove Department":
	  				remDep();
	  				break;

	  			case "Quit":
	  				console.log("Goodbye");
	  				connection.end();
	  				break;	  			
	  		}
	  	};
	// }


async function addEmployee() {
	roles = await storeRoles();
	employees = await storeEmployees();
	employees.push({name:'No One',value: null});
	let answer = await inquirer
	  	.prompt([{
	  		name:'first_name',
	  		message: "What is the employee's first name?"
	  	},{
	  		name:'last_name',
	  		message: "What is the employee's last name?"
	  	},{
	  		type:'list',
	  		name:'role',
	  		message: "What is the employee's role?",
	  		choices: roles,
	  	},{
	  		type:'list',
	  		name:'manager',
	  		message: "Who is the employee's manager?",
	  		choices: employees,
	  	}]);
	insertEmp(answer.first_name,answer.last_name,answer.role,answer.manager);
}

async function removeEmployee() {
	employees = await storeEmployees();
	let answer = await inquirer.prompt([{
	  		type:'list',
	  		name:'which',
	  		message:"Which employee do you want to remove?",
	  		choices: employees,
	  	}]);
	delEmp(answer.which);
}

async function addRole() {
	departments = await storeDepartments();
	let answer = await inquirer
	  	.prompt([{
	  		name:'title',
	  		message:"What is the role?",
	  	},{
	  		name:'salary',
	  		message:"What is the annual salary?"
	  	},{
	  		type:'list',
	  		name:'department',
	  		message:"What department does this rle belong to?",
	  		choices: departments,
	  	}]);
	insertRl(answer.title,answer.salary,answer.department);
}

async function remRole() {
	roles = await storeRoles();
	let answer = await inquirer
	  	.prompt([{
	  		type:'list',
	  		name:'what',
	  		message:"What type of role do you want to remove?",
	  		choices: roles,
	  	}]);
	delRl(answer.what);
}

async function addDep() {
	let answer = await inquirer
	  	.prompt([{
	  		name:'name',
	  		message:"What is the name of the department you want to add?",
	  	}]);
	insertDep(answer.name);
}

async function remDep() {
	departments = await storeDepartments();
	console.log(departments);
	let answer = await inquirer
	  	.prompt([{
	  		type:'list',
	  		name:'what',
	  		message:"What type of department do you want to remove?",
	  		choices: departments,
	  	}]);
	 console.log(answer.what);
	delDep(answer.what);
}

start();