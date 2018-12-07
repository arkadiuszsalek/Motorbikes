
let express = require("express"); // call express to be used by the application.
let app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
let Cart = require('./models/cart');
let fs = require('fs');
app.set('view engine', 'jade');

let session = require('express-session');

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

let mysql = require('mysql'); // allow access to sql

app.use(express.static("scripts")); // allow the application to access the scripts folder contents to use in the application
app.use(express.static("images")); // allow the application to access the images folder contents to use in the application
app.use(express.static("models"));

let reviews = require("./models/reviews.json")// allow the app to access the reviews.json file

app.use(session({ secret: "topsecret" })); // Requird to make the session accessable throughouty the application

//res.locals is a object pass to jade engine
app.use(function(req,res,next){
  res.locals.session=req.session;
  next();
})

/*   ---------    Database connection section  -----------  */

// Connect to database
const db = mysql.createConnection({
  host: 'den1.mysql1.gear.host',
  user: 'arkadiusz',
  password: 'Yn16CwO_L-oU',
  database: 'arkadiusz',
})

db.connect((err) => {
  if (err) {
    console.log("Connection Refused ... Please check login details");
    // throw(err)
  }
  else {
    console.log("Well done you are connected....");
  }
});


/*   ---------    Create tables in Database section   ---------------  */

// Create a Database Table motorbikes
app.get('/createtable', function (req, res) {
  let sql = 'CREATE TABLE motorbikes (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Model varchar(255)), Quantity int;'
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
  res.send("Motorbikes Table Created")
});

// Create a Database Table users
app.get('/createtableUsers', function (req, res) {
  let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Email varchar(255), Password varchar(255));'
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
  res.send("UserTable Created")
});

// Create a Database Table service
app.get('/createtableService', function (req, res) {
  let sql = 'CREATE TABLE service (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Phone varchar(255), Town varchar(255), Address varchar(255));'
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
  res.send("ServiceTable Created")
});

// End create table 


/*   -------   Insert sample motorbike to Database section  ---------   */

// Insert to motorbike table
app.get('/insert', function (req, res) {
  let sql = 'INSERT INTO motorbikes (Name, Price, Image, Model, Quantity) VALUES ("bela", 500, "city1.jpg", "city", 20);'
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
});

// Insert to service table
app.get('/insert2', function (req, res) {
  let sql = 'INSERT INTO service (Name, Phone, Town, Address) VALUES ("test2", "test", "test", "test");'
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
    console.log("added");
  });
});

// End SQL Insert Data Example


/*   ---------    Render pages section   ----------------------------  */

// function to render the index page
app.get('/', function (req, res) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart = cart;
  res.render('index', { root: VIEWS });
  console.log("Now you are at Home Page!");

});

// function to render the index2( admin dashboard) page
app.get('/admindashboard', function (req, res) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart = cart;
  if (req.session.admin == "true") {
    res.render('index2', { root: VIEWS });
  }
  else {
    res.redirect('/alert');
  }
});

// function to render the motorbikes page for user
app.get('/motorbikes', function (req, res) {
  let sql = 'SELECT * FROM motorbikes;'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('motorbikes', { root: VIEWS, res1 }); // use the render command so that the response object renders a HTML page
  });
  console.log("Now you are on the motorbikes page!");
});

// function to render the motorbikes page for admin
app.get('/adminmotorbike', function (req, res) {
  let sql = 'SELECT * FROM motorbikes;'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('adminmotorbike', { root: VIEWS, res1 }); // use the render command so that the response object renders a HTML page
  });
  console.log("Now you are on the admin motorbikes page!");
});

// function to render the service page for user
app.get('/service', function (req, res) {
  let sql = 'SELECT * FROM service;'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('service', { root: VIEWS, res1 }); // use the render command so that the response object renders a HTML page
  });
  console.log("Now you are on the servicepage!");
});

// function to render the service page for admin
app.get('/adminservice', function (req, res) {
  let sql = 'SELECT * FROM service;'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('adminservice', { root: VIEWS, res1 }); // use the render command so that the response object renders a HTML page
  });
  console.log("Now you are on the admin servicepage!");
});

// function to render the individual motorbike page
app.get('/item/:id', function (req, res) {
  let sql = 'SELECT * FROM motorbikes WHERE Id = "' + req.params.id + '";'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('item', { root: VIEWS, res1 }); // use the render command so that the response object renders a HTML page 
  });
});

// function to render the individual service page
app.get('/item2/:id', function (req, res) {
  let sql = 'SELECT * FROM service WHERE Id = "' + req.params.id + '";'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('item2', { root: VIEWS, res1 }); // use the render command so that the response object renders a HTML page 
  });
});

// function to render the create page - add motorbike - for admin
app.get('/create', function (req, res) {
  if (req.session.admin == "true") {
    res.render('create', { root: VIEWS });
    console.log("Now you are ready to create!");
  }
  else {
    res.redirect('/login');
  }
});

// function to render the create2 page - add service - for admin
app.get('/create2', function (req, res) {
  if (req.session.admin == "true") {
    res.render('create2', { root: VIEWS });
    console.log("Now you are ready to create!");
  }
  else {
    res.redirect('/login');
  }
});

// function to render the contact page
app.get('/contact', function (req, res) {
  res.render('contact', { root: VIEWS });
  console.log("Now you are on contactus page!")
});

// function to render the service page
// app.get('/service', function (req, res) {
//   res.render('service', { root: VIEWS });
//   console.log("Now you are on service page!")
// });

// function to render the alert page
app.get('/alert', function (req, res) {
  res.render('alert', { root: VIEWS });
  console.log("Now you are on alert page!")
});

// function to render the confirm page after PayPall payment
app.get('/confirm', function (req, res) {
  res.render('confirm', { root: VIEWS });
  console.log("Now you are on confirm page!")
});



/*   ---------    Add products/service to Database section   --------  */

// function to add data to database table motorbike based on button press and form - admin
app.post('/create', function (req, res) {
  if (req.session.admin == "true") {
    var name = req.body.name
    let sql = 'INSERT INTO motorbikes (Name, Price, Image, Model, Quantity) VALUES ("' + name + '", ' + req.body.price + ', "' + req.body.image + '", "' + req.body.model + '", "' + req.body.quantity + '");'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
    });
    res.redirect('/adminmotorbike');
  }
  else {
    res.redirect('/alert');
  }
});

// function to add data to database table service based on button press and form -admin
app.post('/create2', function (req, res) {
  if (req.session.admin == "true") {
    let name = req.body.name
    let sql = 'INSERT INTO service (Name, Phone, Town, Address) VALUES ("' + name + '", ' + req.body.phone + ', "' + req.body.town + '", "' + req.body.address + '");'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
    });
    res.redirect('/adminservice');
  }
  else {
    res.redirect('/alert');
  }
});


/*   -----  Edit individual motorbike/service page section   -------  */

// function to edit individual motorbike from database based on button press -user
app.get('/edit/:id', function (req, res) {
  let sql = 'SELECT * FROM motorbikes WHERE Id = "' + req.params.id + '";'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('edit', { root: VIEWS, res1 }); // use the render command so that the response object renders a HHTML page 
  });
});

// function to edit individual service from database based on button press  -user
app.get('/editservice/:id', function (req, res) {
  let sql = 'SELECT * FROM service WHERE Id = "' + req.params.id + '";'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('editservice', { root: VIEWS, res1 }); // use the render command so that the response object renders a HHTML page 
  });
});


/*   ----   Update individual motorbike/service page section  ------   */

// function to update individual motorbike from database based on button press and form -admin
app.post('/edit/:id', function (req, res) {
  if (req.session.admin == "true") {
    let sql = 'UPDATE motorbikes SET Name = "' + req.body.newname + '", Price = "' + req.body.newprice + '", Model = "' + req.body.newmodel + '", Image = "' + req.body.newimage + '", Quantity = "' + req.body.quantity + '" WHERE Id = "' + req.params.id + '";'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
    })
    res.redirect('/adminmotorbike');
  } else {
    res.redirect('/login');
  }
});

// function to update individual sevice from database based on button press and form - admin
app.post('/editservice/:id', function (req, res) {
  if (req.session.admin == "true") {
    let sql = 'UPDATE service SET Name = "' + req.body.newname + '", Phone = "' + req.body.newphone + '", Town = "' + req.body.newtown + '", Address = "' + req.body.newaddress + '" WHERE Id = "' + req.params.id + '";'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
    })
    res.redirect('/adminservice');
  } else {
    res.redirect('/login');
  }
});

/*   -----  Delete individual motorbike/promotion page section  -----   */

// function to delete motorbike from database based on button press - admin
app.get('/delete/:id', function (req, res) {
  if (req.session.admin == "true") {
    let sql = 'DELETE FROM motorbikes WHERE Id = "' + req.params.id + '";'
    let query = db.query(sql, (err, res1) => {
      if (err)
        throw (err);
      res.redirect('/adminmotorbike'); // use the render command so that the response object renders a HTML page
    });
  } else {
    res.redirect('/login');
  }
});

// function to delete bike from database based on button press - admin
app.get('/deleteservice/:id', function (req, res) {
  if (req.session.admin == "true") {
    let sql = 'DELETE FROM service WHERE Id = "' + req.params.id + '";'
    let query = db.query(sql, (err, res1) => {
      if (err)
        throw (err);
      res.redirect('/adminservice'); // use the render command so that the response object renders a HTML page
    });
  } else {
    res.redirect('/login');
  }
});

/*   ---------    JSON data manipulation section   ---------------   */

// From here on is JSON DATA Manipulation 
app.get('/reviews', function (req, res) {
  res.render("reviews", { reviews: reviews }
  );
}
);

// From here on is JSON DATA Manipulation 
app.get('/adminreviews', function (req, res) {
  res.render("adminreviews", { reviews: reviews }
  );
}
);

// route to render add JSON page
app.get('/add', function (req, res) {
  res.render('add', { root: VIEWS });
});

// post request to add JSON REVIEW
app.post('/add', function (req, res) {

  // This will look for the current largest id in the reviews JSON file, reviews have an auto ID  
  function getMax(reviews, id) {
    let max
    for (let i = 0; i < reviews.length; i++) {
      if (!max || parseInt(reviews[i][id]) > parseInt(max[id]))
        max = reviews[i];

    }
    return max;
  }

  let maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
  newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1

  // create a new product based on what we have in our form on the add page 
  let review = {
    name: req.body.name, // name called from the add.jade page textbox
    id: newId, // this is the variable created above
    content: req.body.content, // content called from the add.jade page textbox

  };
  let json = JSON.stringify(reviews); // Convert from object to string

  // The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
  fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      throw (err);
    } else {
      reviews.push(review); // add the information from the above variable
      json = JSON.stringify(reviews, null, 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
      fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
    }
  });
  res.redirect('/reviews')
});

// Page to render edit review 

// This function filters the reviews by looking for any review which has an Id the same as the one passed in the url
app.get('/editreviews/:id', function (req, res) {
  function chooseProd(indOne) {
    return indOne.id === parseInt(req.params.id)

  }
  // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  let indOne = reviews.filter(chooseProd);
  // pass the filtered JSON data to the page as indOne
  res.render('editreview', { indOne: indOne });
});


// end Page to edit review 

// Create post request to edit the individual review
app.post('/editreviews/:id', function (req, res) {
  if (req.session.admin == "true") {
    let json = JSON.stringify(reviews);
    let keyToFind = parseInt(req.params.id); // Id passed through the url
    let data = reviews; // declare data as the reviews json file
    let index = data.map(function (d) { return d['id']; }).indexOf(keyToFind) // use the paramater passed in the url as a pointer to find the correct review to edit
    let y = req.body.content
    let z = parseInt(req.params.id)
    reviews.splice(index, 1, { name: req.body.name, content: y, id: z });
    json = JSON.stringify(reviews, null, 4);
    fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
    res.redirect('/adminreviews');
  } else {
    // res.redirect('/login');

  }
});

// end post request to edit the individual review

// route to delete review
app.get('/deletereview/:id', function (req, res) {
  if (req.session.admin == "true") {
    let json = JSON.stringify(reviews); // this is to Convert it from an object to string with stringify for use below

    fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {

        let keytoFind = req.params.id; // find the review by id
        console.log(keytoFind);

        let str2 = reviews; // this changes the json to a variable str2

        let newId = parseInt(req.params.id);// parse string to integer

        let data = str2; //this declares data = str2
        let index2 = data.map(function (d) { return d['id']; }).indexOf(newId) // finds the position by id 
        reviews.splice(index2, 1); // deletes one item from position represented by index 2 (its position) from above      

        json = JSON.stringify(reviews, null, 4); //convert it back to json
        fs.writeFile('./models/reviews.json', json, 'utf8'); // write it back 
        console.log("Review Deleted");
      }
    });
    res.redirect("/adminreviews");
  } else {
    res.redirect('/login');
  }
});

// end route to delete review

/*   ---------------    SEARCH FUNCTION SERVICE  ----------------   */

// Search service function 

app.post('/search', function (req, res) {
  let sql = 'SELECT * FROM service WHERE town LIKE "%' + req.body.search + '%";'
  let query = db.query(sql, (err, res1) => {
    if (err)
      throw (err);
    res.render('service', { root: VIEWS, res1 });
  });
});

// end search function

/* ------ Log / log-out in and registration functions -------------- */

// Render register page 
app.get('/register', function (req, res) {
  res.render('register', { root: VIEWS });
});

// stick user into database 
app.post('/register', function (req, res) {
  db.query('INSERT INTO users (Name, Email, Password) VALUES ("' + req.body.name + '", "' + req.body.email + '", "' + req.body.password + '")'
  );
  res.redirect('/login');
});


// Render login page 
app.get('/login', function (req, res) {
  res.render('login', { root: VIEWS });
});


app.post('/login', function (req, res) {
  let whichOne = req.body.name; // What doe the user type in the name text box
  let whichPass = req.body.password; // What doe the user type in the password text box

  let sql2 = 'Select name, password FROM users WHERE name = "' + req.body.name + '"'
  let query = db.query(sql2, (err, res2) => {

    try {
      let passx = res2[0].password;
      let passxn = res2[0].name;
      req.session.email = "LoggedIn"
      req.session.admin = "false"
      if (passx == "Administrator" && passxn == "Administrator" && passx == whichPass) {
        req.session.admin = "true";  // if you will login as Administrator session.admin assign to false
      }
      if (passx == whichPass) {
        res.redirect("/");
      }
    } catch (err) {
      res.redirect("/register");
    } // If you don't have account redirect user to register page
  });
});

// Log Out Route 
app.get('/logout', function (req, res) {
  req.session.email="";
  req.session.admin="false";
  res.redirect("/");
})
// end logout route 


/* ---------------- Add to card functions  -------------------- */

// add to cart base on id
app.get('/addToCart/:id', function (req, res, next) {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let parametr = req.params.id; //catch string from URL
  let motorData =[];   //create array of data
  motorData = parametr.split("*"); //split string base of * sign
  let price = parseInt(motorData[1]); //convert price(string) to Int
  let id = parseInt(motorData[0]); // convert id(string) to Int
  cart.add(motorData[2], price, id); //add data to cart
  req.session.cart = cart;
  let sql = 'UPDATE motorbikes SET Quantity =  quantity-1 WHERE Id = "' + id +'" AND Quantity>0;'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
  })
  res.redirect('/motorbikes');
});

// render cart
app.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render("cart", { products: null });
  }
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  
  let motorbikes =cart.getItems();
  let str1 = JSON.stringify(motorbikes); //convert to string
  let str2= str1.replace('},{',' / '); // replace characters in string
  let str3= str2.replace( /"item"|{|}|"|[|]/g ,'');//remove few characters from string
  let order="Motorbikes shop - " + str3; //create description for Paypal
  
  res.render("cart", {
    products: cart.getItems(),
    totalPrice: cart.totalPrice,
    description:order,
  });
});

// remove from card
app.get('/removefromcard/:id', function(req, res, next) {
  let cart = new Cart(req.session.cart);
  let parametr = req.params.id; //catch string from URL
  let motorData =[];   //create array of data
  motorData = parametr.split("*"); //split string base of * sign
  let quantity = parseInt(motorData[1]); //convert price(string) to Int
  let id = parseInt(motorData[0]); // convert id(string) to Int
  cart.remove(id);
  req.session.cart = cart;
  let sql = 'UPDATE motorbikes SET Quantity =  quantity + "' + quantity +'" WHERE Id = "' + id +'";'
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(res);
  })
  res.redirect('/cart');
});

/*------ Log / log-out in and registration functions ----------------*/

//  set the requirements for teh application to run
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  console.log("App is Running");
});

module.exports = app; // export app needed for tests




