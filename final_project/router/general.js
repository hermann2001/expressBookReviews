const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) return res.status(404).json({message: "Unable username and password !"});

  if (isValid(username)) return res.status(404).json({message: "This user already exist !"});

  users.push({"username" : username, "password" : password});
  return res.status(201).json({message: "User successfully redistered !"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

public_users.get('/async', (req, res) => {
    axios.get("http://localhost:5000/").then(response =>{
        return res.send(response.data);
    }).catch (error => {
        return res.status(500).json({ error: error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).send("no book with isbn " + isbn)
  }

  return res.status(200).json({isbn: isbn, book : books[isbn]});
 });

public_users.get('/async/isbn/:isbn', (req, res) => {
    axios.get("http://localhost:5000/isbn/:isbn").then(response =>{
        return res.send(response.data);
    }).catch (error => {
        return res.status(500).json({ error: error });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const booksDetails = Object.entries(books).filter(([isbn, b]) => b.author === author);

  if (booksDetails.length == 0) return res.status(404).send("no books with author " + author)

  return res.status(200).json(booksDetails);
});

public_users.get('/async/author/:author', (req, res) => {
    axios.get("http://localhost:5000/author/:author").then(response =>{
        return res.send(response.data);
    }).catch (error => {
        return res.status(500).json({ error: error });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const bookDetails = Object.entries(books).find(([isbn, b]) => b.title === title);

  if (!bookDetails) return res.status(404).send("no books with title " + title)

  return res.status(200).json(bookDetails);
});

public_users.get('/async/title/:title', (req, res) => {
    axios.get("http://localhost:5000/title/:title").then(response =>{
        return res.send(response.data);
    }).catch (error => {
        return res.status(500).json({ error: error });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).send("no book with isbn " + isbn)
  }

  return res.status(200).json({isbn: isbn, reviews : books[isbn]["reviews"]});
});

module.exports.general = public_users;
