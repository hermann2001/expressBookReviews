const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.status(404).json({message: "Unable username and password !"});

  if (!authenticatedUser(username, password)) return res.status(404).json({message: "Invalid Login. Check username and password !"});

  let accessToken = jwt.sign({
    data : password
  }, "accessUser", { expiresIn : 2 * 60 * 60});

  req.session.authorization = {
    accessToken, username
  };

  return res.status(200).json({message: "You are logged in !"});
});

// Add or Update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).send("no book with isbn " + isbn)
  }

  const username = req.session.authorization["username"];

  const review = req.body.review;
  if (!review) res.status(404).send("Unable review !")

  books[isbn]["reviews"][username] = review;

  return res.status(201).json({message: "Review added or updated with success !", bookReviews : books[isbn]["reviews"] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  if (!books[isbn]) {
    return res.status(404).send("no book with isbn " + isbn)
  }
  
  const username = req.session.authorization["username"];

  delete books[isbn]["reviews"][username];

  return res.status(201).json({message: "Review deleted with success !", bookReviews : books[isbn]["reviews"] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
