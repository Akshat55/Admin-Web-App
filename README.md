# Admin-Web-App

## Purpose
The purpose of this project is to learn & teach backend web developement using Node.js & Express. MongoDb & PostgreSQL are used for storing data.

Link: https://safe-beyond-41834.herokuapp.com/

## Installation & Execution
1. Navigate into the forked or clone repo from the terminal
2. type `npm i` to install all of the required dependencies
3. Create a database deployement for MongoDB & PostgreSQL connection (mLab and Heroku respectively or other alternatives)
4. Switch the process environment variables with the values recieved from DaaS platforms or store them in a .env file
5. Run the application using through terminal with the command `node server`

## Dependencies

#### Public
- Mongoose
- Sequelize
- pg
- pg-hstore
- bcryptjs
- client-sessions
- express
- express-handlebars  
`npm install mongoose sequelize pg pg-hstore bcryptjs client-sessions express express-handlebars --save`

#### Developer (Required for hiding usernames,password, database links, etc)
- dotenv  
`npm install dotenv --save-dev`

## Database

### PostgreSQL stores: 
- Departments
- Employees

### MongoDB stores:
- Users
- Comments


## Images
### Landing Page
![Landing](/images/landing-page.JPG)

### Login
![Login](/images/login.JPG)

### Register
![Register](/images/register.JPG)
  
### About Page
![About landing](/images/about-1.JPG)
  
### About Page - Comment section
![About comments](/images/about-2.JPG)
  
### About Page - Comment reply
![About comment reply](/images/about-3.JPG)
  
### Menu
![Menu](/images/menu.JPG)
  
### Edit Account information (update password)
![Edit Profile](/images/edit-profile.JPG)
  
### All Employees
![All Employees](/images/all-employees.JPG)
  
### Create employee
![Create Employee](/images/add-employee.JPG)
  
### Update employee
![Update Employee](/images/edit-employee.JPG)
  
### All departments
![All Departments](/images/all-departments.JPG)
  
### Create department
![Create Department](/images/add-department.JPG)
  
### Update department
![Update Department](/images/edit-department.JPG)

