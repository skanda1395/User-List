const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");

// express app
const app = express();

// connect to mongodb
const dbURI = "mongodb+srv://skanda:L8GOhGtLPGVeyUrw@cluster0.ighcu.mongodb.net/user-data?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to db");
    // listen for requests
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


// user routes
app.get("/create-user", (req, res) => {
  res.render("create", { title: "Create a new user"});
});


app.post("/create-user", (req, res) => {
  console.log("new user data: ", req.body);
  const user = new User(req.body);
  
  user.save()
    .then((result) => {
      res.redirect("/all-users");
    })
    .catch((err) => console.log(err));
});

app.get("/all-users", (req, res) => {
  User.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { title: "All Users", users: result });
    })
    .catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
  // res.send('<p>About page</p>');
  res.render("about", { title: "About"});
});

// 404 page
app.use((req, res) => {
  res.status(404).render("404", {title: "404"})
});