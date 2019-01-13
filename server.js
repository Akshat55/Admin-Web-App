/*********************************************************************************
 * Name: Akshatkumar Patel       GitHub: Akshat55            Date: December 25, 2017
 ********************************************************************************/

var express = require("express");
var dataServer = require("./data-server.js");
const dataServiceComments = require("./data-service-comments.js");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const clientSessions = require('client-sessions');
const dataServiceAuth = require('./data-service-auth.js');
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));


// Setup client-sessions
app.use(clientSessions({
   // this is the object name that will be added to 'req'
  cookieName: "session",
   // Long unguessable string, should be stored in DEV enviornment variable
  secret: "A_very_long_string_should_be_stored_as_ENVIORNMENT_VARIABLE",
   // duration of the session (3 minutes)
  duration: 3 * 60 * 1000,
   // Session will be extended by 3 minutes every request (3 minute)
  activeDuration: 1000 * 60 * 3
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//Allows the handlebar files to be properlly handled - Sets the global default layout to our layout.hbs file
app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");



// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


//Helper middleware function - Checks if a user is logged in
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}



//Setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
  res.render("home");
});



//Renders the updated /about page
app.get("/about", function (req, res) {
  dataServiceComments.getAllComments().then((dataFromPromise) => {
    res.render("about", { data: dataFromPromise });
  }).catch((error) => {
    res.render("about");
  });
});



//Post route to Add Comments
app.post("/about/addComment", (req, res) => {
  dataServiceComments.addComment(req.body).then(() => {
    res.redirect("/about");
  }).catch((error) => {
    console.log(error);
    res.redirect("/about");
  });
});



//Post route to Add Reply to Comments
app.post("/about/addReply", (req, res) => {
  dataServiceComments.addReply(req.body).then(() => {
    res.redirect("/about");
  }).catch((error) => {
    console.log(error);
    res.redirect("/about");
  });
});



//Renders the login page
app.get("/login", (req, res) => {
  res.render("login");
});



//Retrieves the data and validates it - Tries to add it to the database
app.post("/login", (req, res) => {
  dataServiceAuth.checkUser(req.body).then(() => {
    //Adds the user to the session
    req.session.user = {
      username: req.body.user
    };
    res.redirect('/employees');
  }).catch((err) => {
    //Sending user back to the same page, so user doesn't forget/lose their data they entered
    res.render("login", { errorMessage: err, user: req.body.user });
  });
});


//Renders the registration page
app.get("/register", (req, res) => {
  res.render("register");
});



//Reset the session & Log the user out
app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});



//Retrieves the data and validates it - Tries to add it to the database
app.post("/register", (req, res) => {
  dataServiceAuth.registerUser(req.body).then(() => {
    res.render("register", { successMessage: "User created" });
  }).catch((err) => {
    //Sending user back to the same page, so user doesn't forget/lose their data they entered
    res.render("register", { errorMessage: err, user: req.body.user });
  });
});



//Updated password/profile
app.post("/api/updatePassword", ensureLogin, (req, res) => {
  dataServiceAuth.checkUser({ user: req.body.user, password: req.body.currentPassword })
    .then(() => {
      dataServiceAuth.updatePassword(req.body).then(() => {
        res.json({ successMessage: "Password changed successfully for user: " + req.body.user });
      }).catch((error) => {
        res.json({ errorMessage: error });
      });
    }).catch((error) => {
      res.json({ errorMessage: error });
    });
});



//Lists the employees accordingly to query
app.get("/employees", ensureLogin, function (req, res) {

  //Gets the query and returns json accordingly
  if (req.query.status) {                           //Get Employees based on status

    dataServer.getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render("employeeList", { data: data, title: "Employees" });
      }).catch((err) => {
        res.render("employeeList", { data: { err }, title: "Employees" });
      });

  } else if (req.query.department) {                //Get Employees working in department

    dataServer.getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.render("employeeList", { data: data, title: "Employees" });
      }).catch((err) => {
        res.render("employeeList", { data: { err }, title: "Employees" });
      });

  } else if (req.query.manager) {                   //Get Employees working under manager

    dataServer.getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.render("employeeList", { data: data, title: "Employees" });
      }).catch((err) => {
        res.render("employeeList", { data: { err }, title: "Employees" });
      });
  } else {                                          //If "Employees" is routed
    dataServer.getAllEmployees().then((data) => {
      res.render("employeeList", { data: data, title: "Employees" });
    }).catch((err) => {
      res.render("employeeList", { data: { err }, title: "Employees" });
    })
  }
});



//Add employee route
app.get("/employees/add", ensureLogin, (req, res) => {
  dataServer.getDepartments().then((data) => {
    res.render("addEmployee", { departments: data });
  }).catch((error) => {
    res.render("addEmployee", { departments: [] });
  });
});



//Post route to add employee
app.post("/employees/add", ensureLogin, (req, res) => {
  dataServer.addEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});



//Post route to update employee
app.post("/employee/update", ensureLogin, (req, res) => {
  dataServer.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  });
});



//Display a Employees information
app.get("/employee/:empNum", ensureLogin, function (req, res) {
  // initialize an empty object to store the values
  let viewData = {};

  dataServer.getEmployeeByNum(req.params.empNum)
    .then((data) => {
      viewData.data = data; //store employee data in the "viewData" object as "data"
    }).catch(() => {
      viewData.data = null; // set employee to null if there was an error 
    }).then(dataServer.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"

      //Add selected property to the viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.data.department) {
          viewData.departments[i].selected = true;
        }
      }

    }).catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
      if (viewData.data == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
      }
    });
});



//Delete a employee
app.get("/employee/delete/:empNum", ensureLogin, (req, res) => {
  dataServer.deleteEmployeeById(req.params.empNum).then(() => {
    res.redirect("/employees");
  }).catch((error) => {
    res.status(500).send("Unable to remove employee / Employee not found");
  });
});



//List all of the Managers
app.get("/managers", ensureLogin, function (req, res) {
  dataServer.getManagers().then((data) => {
    res.render("employeeList", { data: data, title: "Employees (Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title: "Employees (Managers)" });
  });
});



//List all of the Departments
app.get("/departments", ensureLogin, function (req, res) {
  dataServer.getDepartments().then((data) => {
    res.render("departmentList", { data: data, title: "Departments" });
  }).catch((err) => {
    res.render("departmentList", { data: {}, title: "Departments" });
  });
});



//Render departments add view
app.get("/departments/add", ensureLogin, (req, res) => {
  res.render("addDepartment");
});



//Post the retrieved and processed information
app.post("/departments/add", ensureLogin, (req, res) => {
  dataServer.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  });
});



//Post the department update form to collect the data 
app.post("/department/update", ensureLogin, (req, res) => {
  dataServer.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  });
});



//Gets the department information by departmentId
app.get("/department/:departmentId", ensureLogin, (req, res) => {
  dataServer.getDepartmentById(req.params.departmentId).then((data) => {
    res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department Not Found");
  });
});



//If the Routes do not exist, use this display message
app.use((req, res) => {
  res.status(404).send("Page Not Found!");
});



// setup http server to listen on HTTP_PORT ONLY when connected to database
dataServer.initialize()
  .then(dataServiceComments.initialize())
  .then(dataServiceAuth.initialize())
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart)
  }).catch((err) => {
    console.log(err);
  });


