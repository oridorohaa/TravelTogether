const express = require("express");
const path = require("path");
const http = require("http");
const bodyParser = require("body-parser");
const User = require("./models/user");
const Post = require("./models/post.js");
const Trip = require("./models/trip.js");
const cookieParser = require("cookie-parser");

const app = express();

const server = http.createServer(app);
const MAP_API_STYLE =
  "style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text%7Cvisibility:off&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road%7Celement:labels%7Cvisibility:off&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text%7Cvisibility:off&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e";
const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, "../public");
var morgan = require("morgan");
// morgan("tiny");
app
  .use("/static", express.static(publicDirectoryPath))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.json());

app.use(cookieParser());
app.disable("etag");
app.use(morgan("tiny"));
app.set("views", path.join(__dirname, "../public/views"));

// app.engine(
//   "hbs",
//   handlebars({
//     layoutsDir: __dirname + "../public/views/layouts",
//     extname: "hbs",
//     defaultLayout: "index.js",
//     partialsDir: __dirname + "../public/views/partials/",
//   })
// );
app.set("view engine", "hbs");

// var hbs = exphbs.create({});

//----------Middlewear function
const authUser = async (req, res, next) => {
  username = req.cookies["username"];
  password = req.cookies["password"];
  req.user = await User.findByCredentials(username, password);
  if (req.user) {
    res.cookie("username", req.user.username);
    res.cookie("password", req.user.password);
    next();
  } else {
    if (req.url === "/") {
      res.render("index");
    } else {
      res.redirect("/");
    }
  }
};

const authUserStatic = async (req, res, next) => {
  // console.log("WORKING");
  username = req.cookies["username"];
  password = req.cookies["password"];
  // console.log("INSIDE auth user f username:", username);
  req.user = await User.findByCredentials(username, password);
  // console.log("REQ.USER IS SET", req.user);
  return req.user;
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

function isClose(a, b) {
  return Math.abs(a.getTime() - b.getTime()) < 1000 * 60 * 60 * 12;
}

function decoratePost(post) {
  post = post.toObject();

  date = new Date(post.date);
  // console.log(date, "POST DATE");
  let time;
  let hours = date.getHours();
  // console.log(hours, "POST TIME/Hours");
  if (hours === 12) {
    time = `${hours}:${String(date.getMinutes()).padStart(2, "0")}pm`;
  } else if (hours > 12) {
    time = `${hours - 12}:${String(date.getMinutes()).padStart(2, "0")}pm`;
  } else {
    time = `${hours}:${String(date.getMinutes()).padStart(2, "0")}am`;
  }

  post.time = time;
  post.date = date;

  return post;
}
function decorateDate(day) {
  let t = new Date();
  let tt = new Date(t);
  let y = new Date(t);

  t.setHours(00, 00, 00);
  t.setMilliseconds(0);
  tt.setHours(00, 00, 00);
  tt.setMilliseconds(0);
  y.setHours(00, 00, 00);
  y.setMilliseconds(0);

  tt.setDate(tt.getDate() + 1);
  y.setDate(y.getDate() - 1);
  if (isClose(day, t)) {
    day.t = `Today`;
  } else if (isClose(day, tt)) {
    day.t = `Tomorrow`;
  } else if (isClose(day, y)) {
    day.t = `Yesterday`;
  }
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (!day.t) {
    day.t = `${monthNames[day.getMonth()]} ${day.getDate()}`;
  }
  return day;
}
// ---------------------USER Routers
app.post("/dologin", async (req, res) => {
  username = req.body.username;
  password = req.body.password;
  req.user = await User.findByCredentials(username, password);
  if (req.user) {
    res.cookie("username", req.user.username);
    res.cookie("password", req.user.password);
    res.redirect("/" + req.user.username);
  } else {
    res.redirect("/login");
  }
});

app.post("/doregister", async (req, res) => {
  const user = new User(req.body);
  const existing = await User.findOne({ username: req.body.username });

  if (!existing) {
    try {
      await user.save();
    } catch (e) {
      // errro
      res.cookie("message", "Could not create user because " + e);
      return res.redirect("/register");
      console.log(e);
    }
    const token = await user.generateAuthToken();
    res.cookie("username", user.username);
    res.cookie("password", user.password);
    res.redirect("/" + user.username);
  } else {
    res.cookie(
      "message",
      "Username already taken. Please try a different name."
    );
    res.redirect("/register");
  }
});

// ALL TRIPS
app.get("/alltrips", authUser, async (req, res) => {
  let _id = req.user.id;
  console.log(_id);
  let trips = await Trip.find({ owner: _id });
  console.log(trips, "trips");
  let tripsObj = trips.map((trip) => {
    trip.toObject();
    return trip;
  });
  let correctUser = req.user.username;
  // console.log("TESTING ALL TRIPS CORRECT USER:", correctUser);

  res.render("alltrips", {
    trips: JSON.stringify(tripsObj),
    correctUser,
  });
});

// USER PROFILE ROUTER
app.get("/:username", async (req, res) => {
  console.log(req.params.username, "TESTING PARAMS USERNAME");
  console.log("TESTING testing TESTING TESTING TESTING");
  const currentUser = await User.findOne({ username: req.params.username });
  req.user = await authUserStatic(req);

  if (!currentUser) return res.redirect("/");
  console.log("req.user INSIDE the FUNCTION we need", req.user);
  // user last seen UpdatedDate
  // is user same as the saved cookies username
  let correctUser = false;
  if (currentUser.id === req.user?.id) {
    console.log("inside IF");
    correctUser = true;
    currentUser.updatedAt = Date.now();
    await currentUser.save();
  }

  // create last seen online time

  let posts = await Post.find({ owner: currentUser._id }).sort({ date: 1 });

  let postsObj = posts.map(decoratePost);

  let trips = await Trip.find({ owner: currentUser._id }).sort({ fromDAte: 1 });

  let days = [];

  let tripsObj = trips.map((trip) => {
    trip = trip.toObject();
    let d = new Date(trip.fromDate);
    d.trip = true;
    d.w = trip.fromDate;
    d.loc = trip._id;
    days.push(d);
    d = new Date(trip.toDate);
    d.trip = true;
    d.w = trip.toDate;
    d.loc = trip._id;
    days.push(d);
    // console.log(trip, "------each trip");
    return trip;
  });
  // console.log(tripsObj, "-----------------TRIPSOBJ");
  // console.log(days, "------------------right after tripsObj.map");

  let today = new Date();
  const DATE_RANGE = 10;
  today.setDate(today.getDate() - DATE_RANGE / 2);

  for (let j = 0; j < DATE_RANGE; j++) {
    today = new Date(today);
    today.setDate(today.getDate() + 1);
    days.push(today);
  }

  days.map((x) => {
    x.setHours(00, 00, 00);
    x.setMilliseconds(0);
  });

  function uniqueDate(value, index, self) {
    //first occurence of this value in this array            //current index
    return self.map((x) => x.getTime()).indexOf(value.getTime()) === index;
  }

  //below expects list of Dates
  days = days.filter(uniqueDate);
  // days = [...new Set(days.map((x) => x.getTime()))].map((x) => new Date(x));

  days.map(decorateDate);

  let output = [];
  // console.log(days, "DAYS");
  output = [...days, ...postsObj.filter((x) => x.date)];
  output.sort((b, a) => {
    // let firstDate;
    // let secondDate;
    // if (a.date){ //its a post
    //   firstDate = a.date.getTime()
    // } else{ //its a day
    //   firstDate = a.getTime();
    // }
    // if (b.date){ //its a post
    //   secondDate = b.date.getTime()
    // } else{ //its a day
    //   secondDate = b.getTime();
    // }
    // return firstDate - secondDate;
    // console.log(a);
    return (a.date ?? a.getTime()) - (b.date ?? b.getTime());
  });

  output = output.reverse();
  // console.log("OUTPUT", output);

  //when adding a divider, check if the last one is a divider and remove it because we don't want multiple dividers in a row without content

  // output=[d,p,p,today,d,p,d,p,p,d]
  //                              c n
  // x=3
  let x = 0;
  while (x < output.length - 1) {
    let curr = output[x];
    let next = output[x + 1];

    if (
      !next.latitude &&
      !curr.latitude &&
      curr.t !== "Today" &&
      curr.t !== "Tomorrow" &&
      curr.t !== "Yesterday" &&
      !curr.trip
    ) {
      output.splice(x, 1);
    } else {
      x++;
    }
  }
  let last = output[output.length - 1];
  let prev = output[output.length - 2];
  if (
    !last.latitude &&
    !prev.latitude &&
    !last.trip &&
    last.t !== "Today" &&
    last.t !== "Tomorrow" &&
    last.t !== "Yesterday"
  ) {
    output.pop();
  }
  // console.log(MAP_API_STYLE);
  // console.log(trips, "------TRIPS");
  // console.log("start-------------", output, "---------------------ALL OUTPUT");
  res.render("home", {
    // object needs to be stringified in
    //  order for javascript to read it in the handlebar html
    correctUser,
    currentUser: JSON.stringify(currentUser),
    user: currentUser.toObject(),
    updatedDate: JSON.stringify(currentUser.updatedDate),
    postsObj,
    output,
    loggedinuser: req.user,
    trips: JSON.stringify(tripsObj),
    MAP_API_STYLE,
  });
});

// UPDATE  USER LOCATION ROUTER
app.post("/updateUserLocation", authUser, async (req, res) => {
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  // console.log(latitude, "LATITUDE");
  // console.log(longitude, "LONGITUDE");
  let id = { _id: req.user._id };
  // console.log(id, "TESTING ID");
  let curUser = await User.findOneAndUpdate(id, {
    $set: { longitude: longitude, latitude: latitude },
  });
  // console.log(curUser, "TESTING CUR USER");
  await curUser.save();
  res.json({ status: "success" });
});

// GET USER COORDS
app.post("/getUserCoords", async (req, res) => {
  let username = req.body.username;
  console.log(username, "TESTING USERNAME from client");
  let user = await User.findOne({ username: username });
  console.log(user, "TESTING USER");
  let latitude = user.latitude;
  console.log("TESTING CUR USER LATITUDE", latitude);
  let longitude = user.longitude;
  res.json({
    status: "success",
    latitude,
    longitude,
  });
});

app.get("/do/logout", async (req, res) => {
  console.log("hi");
  res.clearCookie("username");
  res.clearCookie("password");
  res.redirect("/");
});

// ---------------------Post Routers
app.post("/postToTimeline", authUser, async (req, res) => {
  const post = new Post({ ...req.body, owner: req.user._id });
  await post.save();

  res.json({ status: "success", id: post._id });
});

app.get("/deletePost/:id", authUser, async (req, res) => {
  const _id = req.params.id;
  let post = await Post.findOne({ _id: _id });
  if (post.owner.toString() === req.user.id) {
    await Post.findOneAndDelete({ _id: _id });
    console.log("One Post Deleted");
  } else {
    res.send("You are not Authorized to delete this Post");
    return;
  }

  res.redirect(req.get("referer"));
});

// -----------------Description Routers

app.post("/postDescrip", authUser, async (req, res) => {
  // console.log(req.body, "REQ.BODY");
  const _id = { _id: req.body.id };
  const description = { description: req.body.description };
  const currPost = await Post.findOneAndUpdate(_id, description);

  await currPost.save();

  res.json({ status: "success" });

  // res.redirect("/timelineHome");
});

app.get("/editDescrip", authUser, async (req, res) => {
  const id = { _id: req.body.id };
  const description = { description: req.body.description };
  const currPost = await Post.findOneAndUpdate(_id, description);
  await currPost.save();
  res.json({ status: "success" });
});

// ---------------------Trip Routers
app.post("/newTriptoTimeline", authUser, async (req, res) => {
  // console.log(req.body);
  // console.log(req.user._id);
  const trip = new Trip({ ...req.body, owner: req.user._id });
  await trip.save();
  // console.log(trip);
  res.json({ status: "success" });
});

app.post("/deleteTrip/:id", async (req, res) => {
  const _id = req.body.id;
  // let curtrip = await Trip.findOne({ _id: _id });
  // console.log(curtrip);
  await Trip.findOneAndDelete({ _id: _id });
  res.json({ status: "success" });
});

app.get("/test", authUser, async (req, res) => {
  res.json({ status: "success" });
});

//------------Mongoose connect to MongoDB
const mongoose = require("mongoose");
const { findOneAndUpdate } = require("./models/user");
const { handlebars } = require("hbs");
mongoose.connect(
  "mongodb+srv://traveltogether:travel@cluster0.ldmcn.mongodb.net/travel-api?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);

const con = mongoose.connection;
con.on("open", () => {
  console.log("Connected...");
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
