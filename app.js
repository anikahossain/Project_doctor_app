var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
var bcrypt = require('bcrypt');
var db = pgp(process.env.DATABASE_URL || 'postgres://anikakazi@localhost:5432/doctorapp');


app.listen(8080,function(){
  console.log('server is alive on 8080.')
});

/* BCrypt stuff here */
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


//homepage
app.get("/", function(req, res){
  var logged_in;
  var email;
  var id;
  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
    id = req.session.user.id
  }

  var user = {
    "logged_in": logged_in,
    "email": email,
    "id": id
  }
  res.render("index");
});

//takes you to signup page to create new account
app.get("/sign_up", function(req, res){
  res.render("sign_up/sign_up");
});

//takes you to the login page to log into account
app.get("/login", function(req, res){
  res.render("login/login");
});

//takes you to the search page
//params = get variables
app.get("/quick_search", function(req, res){
  // var id = req.params.id;
  var logged_in;
  var email;
  var id;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
    id = req.session.user.id
  }

  var user = {
    "logged_in": logged_in,
    "email": email,
    "id": id
  }
  res.render("quick_search/quick_search", user);
});


//takes you to user dashboard
app.get("/userdashboard", function(req, res){
  console.log(req.session.user)
  var logged_in;
  var email;
  var id;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
    id = req.session.user.id
  }

  var user = {
    "logged_in": logged_in,
    "email": email,
    "id": id
  }
  res.render("userdashboard", user);
})

//routes back to homepage
app.get("/sign_up", function(req, res){
  res.r("index");
});

app.get('/logout', function(req,res){
  req.session.user = null;
  res.redirect('/')
})



//posts login into to userdashboard
// app.post("/userdashboard", function(req, res){
//   console.log("HIT POST USERDASHBOARD")
//   res.render("userdashboard");
// });

// app.post("/signup", function(req,res){
//   console.log(req.body.email, req.body.password);

//   db.one("INSERT INTO users(email, password_digest) values($1, $2) returning id", [req.body.email, req.body.password])
//     .then(function(data){
//       console.log(data.id);
//       res.render("userdashboard", {id: data.id});
//     })
//     .catch(function(error){
//       console.log("Error, User could not be made", error.message || error);
//     });
// });


// app.post("/userdashboard", function(req, res){
//   console.log(req.body.email, req.body.password);

//   db.one("INSERT INTO users(email, password_digest) values($1, $2) returning id", [req.body.email, req.body.password])
//   .then(function(data){
//     console.log(data.id);
//     res.render("userdashboard", {id: data.id});
//   })
//   .catch(function(error){
//     console.log("Error, User could not be made", error.message || error);
//   });
// })

app.post("/signup", function(req, res){
  var data = req.body;
  console.log(data);
  bcrypt.hash(data.password, 10, function(err, hash){
    db.one(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2) returning *",
      [data.email, hash]
    // ).then(function(data){
    //   console.log("user email", data);
    //   db.one(
    //     "SELECT * FROM users WHERE email=$1",[data.email])
    // })
    )
    .then(function(user){
      console.log("user", user);
        req.session.user = user;
        res.redirect('/userdashboard');
    })
    .catch(function(error){
      console.log("Error, User could not be made", error.message || error);
    })
  });
});

app.post('/login', function(req, res){
  var data = req.body;

  db.one(
    "SELECT * FROM users WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.send('Email/Password not found.')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.redirect('/userdashboard');
      } else {
        res.send('Email/Password not found.')
      }
    });
  });
});



app.post('/saveDoctor', function(req, res){
  var uid = req.body.uid;
  db.none("INSERT INTO preferences (user_id, url_string) VALUES ($1, $2)", [req.session.user.id, uid]); //prepared statement, alwasy do when submitting data into a database
});

// app.post("/userdashboard", function(req, res){
//   console.log("HIT GET DASHBOARD")
//   var data = req.body;
//   console.log(data);
//     db.one(
//       "SELECT * FROM users WHERE email =$1",
//       [data.email]
//       )
//     .then(function(user){
//       console.log("user", user);
//       res.render("userdashboard", {user: user});
//     })
//     .catch(function(error){
//       console.log("Error, User could not be made", error.message || error);
//     })
//   });


// app.get("/userdashboard", function(req, res){
//   console.log(req.body.id, req.body.email, req.body.password);
//   db.one("SELECT * FROM users WHERE id=)")
//   .then(function(data){
//     console.log(data.id);
//     res.render("userdashboard");
//   })
// })

// app.post("/userdashboard", function(req, res){
//   var data = req.body;
//   bcrypt.hash(data.password, 10, function(err, hash){
//     db.none(
//       "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
//       [data.email, hash]
//       ).then(function(data){
//         console.log("data2", data);
//         res.render("userdashboard", {id: data.id});
//       })
//       .catch(function(error){
//         console.log("Error, User could not be made", error.message || error);
//       })
//   });
// });






// app.get("/apitest", function(req,res){
//   res.render("apitest");
// });
