const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: " ",
    database: "employees_db"

});

connection.connect(err => {
    if (err) {
        console.error("Could not connect due to: " + err.stack);
        return;
    }
    console.log("Connected: " + connection.threadId);
    
    functions.start();
});


const functions = {
    start: () => {
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add an Employee",
                "Add a Role",
                "Add a Department",
                "View Employees",
                "View Roles",
                "View Departments",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function(response) {
            switch (response.action) {
            case "Add an Employee":
                functions.addEmployee();
            break;
            case "Add a Role":
                functions.addRole();
            break;
            case "Add a Department":
                functions.addDepartment();
            break;
            case "View Employees":
                functions.viewEmployee();
            break;
            case "View Roles":
                functions.viewRoles();
            break;
            case "View Departments":
                functions.viewDepartments();
            break;
            case "Update Employee Role":
                functions.updateEmployeeRole();
            break;
            default:
                connection.end();
            };
        });
    },
    addEmployee: () => {
        const initQuery = "SELECT employee.id, first_name, last_name, role.id, title FROM employee RIGHT JOIN role ON role_id = role.id";
        connection.query(initQuery, function(err, result){
            if (err) throw errr;
            inquirer.prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the first name?",
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the last name?",
                },
                {
                    name: "title",
                    type: "list",
                    message: "What is the employee's title?",
                    choices: function(){
                        let titleArray = [];
                        for (i = 0; i < result.length; i++){
                            if (!titleArray.includes(result[i].title)){
                                titleArray.push(result[i].title)
                            };
                        };
                        return titleArray;
                    }
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: function(){
                        let managerArray = ["None"];
                        for (i = 0; i < result.length; i++){
                            if (result[i].first_name !== null && result[i].last_name !== null){
                                managerArray.push(result[i].first_name + " " + result[i].last_name)
                            };
                        };
                        return managerArray;
                    }
                }  
            ]).then(function(data){
                let titleSelect;
                for (i = 0; i < result.length; i ++) {
                    if (result[i].title === data.title) {
                        titleSelect = result[i];
                    };
                };
                const query = "INSERT INTO employee SET ?";
                const set = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role_id: titleSelect.id
                };
                if (managerSelect === "None") {
                    set.manager_id = "None"
                }
                else {
                    set.manager_id = managerSelect
                };
                connection.query(query,set,(err) => {
                    if (err) throw err;
                    functions.viewEmployee();
                }); 
            });
        });
    },

    addRole: () => {
        const initQuery = "SELECT * from department";
        connection.query(initQuery, function(err, result) {
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "role",
                    type: "input",
                    message: "What is the employee's role?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the annual salary?",
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department is the employee in?",
                    choices: result
                }
            ]).then(function(data){
                let selection;
                for (i = 0; i < result.length; i++) {
                    if (result[i].name === data.department){
                        selection = result[i];
                    };
                };
            });
            const query = "INSERT INTO role SET ?";
            const set = {
                title: data.title,
                salary: data.salary,
                department_id: selection.id
            };
            connection.query(query, set, (err) =>{
                if (err) throw err;
                functions.viewRole();
            });
        }); 
    },
    addDepartment: () => {
        const initQuery = "SELECT * from department";
        connection.query(initQuery, function(err, result){
            if (err) throw err;
            inquirer.prompt([
                {
                    name: "department",
                    type: "input",
                    message: "What department would you like to add?"
                }
            ]).then (function(data){
                let newDepartment;
                for (i = 0; i < result.length; i ++) {
                    if(result[i].name === data.department) {
                        newDepartment = result[i].name
                    };
                };
                if ( newDepartment === data.department) {
                    console.log("The department already exists. Please enter a new department.");
                    functions.viewDepartments();
                }else {
                    const query = "INSERT INTO depart SET ?";
                    connection.query(query, {name: data.department}, (err, result) => {
                        if (err) throw err;
                        functions.viewDepartments();
                    });
                };
            });
        });
    },

    viewEmployee: () => {
        const query = "SELECT employee.id, first_name, last_name, title, name, salary, manager_id FROM department JOINrole ON department.id = role.department_id JOIN employee ON role.id = employee.role_id";
        connection.query(query, (err, result) =>{
            if (err) throw err;
            console.table(result);
            functions.start();
        });
    },

    viewRoles: () => {
        const query = "SELECT * from role RIGHT JOIN department ON department_id = department.id";
        connection.query(query, (err, result) => {
            if (err) throw err;
            console.table(result)
            functions.start();
        });
    },

    viewDepartments: () => {
        const query = "SELECT * from department";
        connection.query(query, (err, result) => {
            if (err) throw err,
            console.table(result);
            functions.start();
        });
    },

    updateEmployeeRole: () => {
        const initQuery = "SELECT * FROM employee";
        connection.query(initQuery, function(err, result) {
            if (err) throw err;
            let empArray = [];
            for (var i = 0; i < result.length; i++) {
                name = result1[i].first_name + " " + result1[i].last_name;
                empArray.push(name);
            };
            connection.query("SELECT * FROM role", function (err, result2) {
                if (err) throw err;
                let roleArray = [];
                for (i = 0; i < result2.length; i++){
                    role = result2[i].title
                    roleArray.push(role);
                };
                inquirer.prompt ([
                    {
                        name: "employee",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: empArray
                    },
                    {
                        name: "newRole",
                        type: "list",
                        message: "What is the employee's updated role?",
                        choices: roleArray
                    },
                ]).then(function(data){
                    const query1 = "SELECT * FROM employee";
                    connection.query(query1, (err, result3) => {
                        if (err) throw err;
                        let employee;
                        for (i = 0; i < result3.length; i ++) {
                           if ((result3[i].first_name + " " + result3[i].last_name) === data.employee) {
                               employee = result3[i];
                           };
                        };
                        const query2 = "SELECT * FROM role";
                        connection.query(query2, (err, result4) => {
                            if (err) throw err;
                            let role;
                            for (i = 0; i < result4.length; i++) {
                                if (result4[i].title === data.newRole) {
                                    role = result4[i];
                                };
                            };
                            const query3 = "UPDATE employee SET role_id = ? WHERE id = ?";
                            connection.query(query3, [role.id, employee.id], err => {
                                if (err) throw err;
                                functions.viewEmployee();
                            });
                        });
                    });
                });  
            });
        });
    },
};
module.exports = functions;    