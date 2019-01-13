const Sequelize = require('sequelize');
require('dotenv').config();

//Connects to the database
var sequelize = new Sequelize(process.env.POSTGRE_DATABASE, process.env.POSTGRE_USER, process.env.POSTGRE_PASS, {
    host: process.env.POSTGRE_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

//Employee Model Table - PK: employeeNum
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});


//Department Model Table - PK: departmentId
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});


//Initializes the database by syncing it
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        //Sequalize.sync() synchronizes all the database tables
        sequelize.sync().then(() => {
            resolve();
        }).catch((error) => {
            reject("Unable to sync the database");
        });
    });
}



//Returns all of the employee objects through resolve(Promise)
module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll().then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Returns all employees based on status
module.exports.getEmployeesByStatus = function (emp_status) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status: emp_status
            }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Returns employees based on department
module.exports.getEmployeesByDepartment = function (emp_department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department: emp_department
            }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Get Employees that work under a specific manager
module.exports.getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Returns a single employee object
module.exports.getEmployeeByNum = function (num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Returns a list of ALL the managers
module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Returns ALL of the departments (The departments global array)
module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        Department.findAll().then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned!");
        });
    });
}



//Adds employees to the existing employee array
module.exports.addEmployee = function (employeeData) {

    return new Promise((resolve, reject) => {
        //Assigns true or false to the isManager attribute
        employeeData.isManager = (employeeData.isManager) ? true : false;

        //Checks to see if any of the attributes are empty, sets them to null
        for (var index in employeeData) {
            if (employeeData[index] == "") {
                employeeData[index] = null;
            }
        }

        Employee.create({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject("Unable to create employee");
        });
    });
}



//Updates the existing employee
module.exports.updateEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        //Assigns true or false to the isManager attribute
        employeeData.isManager = (employeeData.isManager) ? true : false;

        //Checks to see if any of the attributes are empty, sets them to null
        for (var index in employeeData) {
            if (employeeData[index] == "") {
                employeeData[index] = null;
            }
        }
        //Everything is updated again EXCEPT SSN && hireDate as they can be changed using inspect element and updated.
        //Therefore SSN & hireDate can only be updated using pgAdmin
        Employee.update({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
        }, {
                where: { employeeNum: employeeData.employeeNum }
            }).then(() => {
                resolve();
            }).catch((error) => {
                reject("Unable to update employee");
            });
    });
}



//Add a department
module.exports.addDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {

        //Checks to see if any of the attributes are empty, sets them to null
        for (var index in Department) {
            if (departmentData[index] == "") {
                departmentData[index] = null;
            }
        }

        //Creates an entry in the Department Table
        Department.create({
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject("Unable to add department");
        });
    });
}



//Update an existing department
module.exports.updateDepartment = function (departmentData) {
    return new Promise((resolve, reject) => {

        //Checks to see if any of the attributes are empty, sets them to null
        for (var index in Department) {
            if (departmentData[index] == "") {
                departmentData[index] = null;
            }
        }

        //Update an entry in the Department Table
        Department.update({
            departmentName: departmentData.departmentName
        }, {
                where: { departmentId: departmentData.departmentId }
            }).then(() => {
                resolve();
            }).catch((error) => {
                reject("Unable to update department");
            });
    });
}



//Return a department(information) by id
module.exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {
                departmentId: id
            }
        }).then((data) => {
            resolve(data[0]);
        }).catch((error) => {
            reject("No results returned");
        });
    });
}



//Delete an employee by ID
module.exports.deleteEmployeeById = function (id) {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: { employeeNum: id }
        }).then(() => {
            resolve();
        }).catch((error) => {
            reject("Unable to Delete Employee");
        })
    });
} 

