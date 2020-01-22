# new-nodejs-task
CONTENTS OF THIS FILE
---------------------
   
 * Introduction
 * Requirements
 * Installation
 * Configuration
 
INTRODUCTION
------------

* This project can be used to register the user which accept the registration data
  from user (email , password, age ,username,role) and save them in to MONGO DB. 
  send back any error /success as response.
* Implement the Login authentication with JWT. Accept username/password and ensure 
  the jwt token generated and used to authenticate the CRUD API calls.


REQUIREMENTS
------------

This module requires the following modules:

 * DB (for mongodb connection)
 * Model(for Database model)
 * src(for index.js file to start the project)
 * route (for which ccept the routes and eecuted relted Rest API's)
 
 INSTALLATION
 --------------
 
* take a clone or download a zip from github then run npm install.
  it will install all required npm package which are used in this project.
* then type the below command o run the project
  >> npm run dev 
* then open localhost:3005/  it will give the following data one the browser
  >> user data
* for user registration we need to hit the following url from postman
  >> localhost:3005/users/registration
  then we need to pass data in body like name, age, password, email
  
* for user login we need to hit the following url from the postman
  >> localhost:3005/users/login 
   . then we need to pass data in the body fields like email, password then it will check exist or not.
 
* for getting userslist from the user Model
  >> localhost:3005/users/list
   .. then we need to pass headers to this method. header will be 
     Authorization: 'JwT Token for specified user'. if the user Autharized then will show the users list.
     
* for delete user form user model
  >> localhost:3005/users/delete 
  .. then we need to pass headers to this method. header will be 
     Authorization: 'JwT Token for specified user'. if the user Autharized then wil delete the user from userModel.
     
*  for checking paranthesis pattern 
  >> localhost:3005/users/balanced
  .. then we need to pass headers to this method. header will be 
     Authorization: 'JwT Token for specified user' and then also pass the data in body like ({[]})  
     then it will check authorization and valid paranthesis then it will create balance moel for the user
     along with number of attemps he did then will be updated on every request.
