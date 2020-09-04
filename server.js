const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var userSchema = new mongoose.Schema({
  userName: String
});

var User = mongoose.model("User", userSchema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", (req, res) => {
  var name = req.body.username;

  User.find({ userName: name }, (err, result) => {
    if (result.length > 0) {
      return res.json("Name already taken");
    } else {
      var insertUser = new User({ userName: name });

      insertUser.save((err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json({ username: result.userName, _id: result._id });
        }
      });
    }
  });
});

app.get("/api/exercise/users", (req, res) => {
  User.find({}, (err, result) => {
    res.json(result);
  });
});

app.post("/api/exercise/add", (req, res) => {
  User.Update(
    { _id: req.body.userId },
    { game: "rugby" },
    { upsert: true },
    (err, result) => {
      res.json(result);
    }
  );
});

// Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// })

// Error Handling middleware
// app.use((err, req, res, next) => {
//   let errCode, errMessage

//   if (err.errors) {
//     // mongoose validation error
//     errCode = 400 // bad request
//     const keys = Object.keys(err.errors)
//     // report the first validation error
//     errMessage = err.errors[keys[0]].message
//   } else {
//     // generic or custom error
//     errCode = err.status || 500
//     errMessage = err.message || 'Internal Server Error'
//   }
//   res.status(errCode).type('txt')
//     .send(errMessage)
// })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
