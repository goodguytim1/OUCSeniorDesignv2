var express  = require("express"),
  mongoose   = require("mongoose"),
  bodyParser = require("body-parser"),
  path       = require("path"),
  http       = require("http"),
  webSocket  = require("ws"),
  io         = require("socket.io"),
  url        = require("url"),
  cors       = require("cors"), // cors is required for the api to be able to recieve and respond to requests from the frontend
  //cron       = require("cron"), // for scheduling the emailer
  nodemailer = require("nodemailer"); // for sending emails

var app = express(),
  streamServer = http.createServer(app),
  socketio = io(streamServer),
  channels = {},
  viewers = {},
  port = process.env.PORT || 3000;



function addValueToList(map, key, value) {
  //if the list is already created for the "key", then uses it
  //else creates new list for the "key" to store multiple values in it.
  map[key] = map[key] || [];
  map[key].push(value);
}

//sanity check

function createChannel(path) {
  tmpServer = new webSocket.Server({ noServer: true });
    tmpServer.on("connection", function connection(ws) {
      addValueToList(viewers, path, ws);
  });
  channels[path] = tmpServer
}

function initChannels() {
  createChannel("/sub-27");
  createChannel("/sub-28");
  createChannel("/sub-29");
  createChannel("/sub-33");
  createChannel("/sub-38");
  createChannel("/sub-40")
}

//todo: Try to move route() back to livestreamRoutes.js
function route() {
  var router = express.Router();

  router.route("/:id").post((request, response) => {
    var locationID = request.params.id;
    console.log("location " + locationID + " connected");
    request.on("data", function (data) {
      pushData("/" + locationID, data);
    });
  });
  return router;
}

// this function sets up the base URLs that the routers will expand on
// for example if the backend is hosted on localhost, "https://localhost:3000/weatherData"
// will be the base URL for requesting weather data, and "weatherDataRouter.js" will
// expand on that URL for specific requests (eg "https://localhost:3000/weatherData/getall")
function init_routes() {
  var testAPIRouter          = require("./api/routes/testAPIRouter");
  var weatherDataRouter      = require("./api/routes/weatherDataRouter");
  var powerPredictionsRouter = require("./api/routes/powerPredictionsRouter");
  var cloudCoverageDataRouter = require("./api/routes/cloudCoverageDataRouter");
  //var cloudDataRouter        = require("./api/routes/cloudDataRouter");
  //var legacyCloudCoverageRouter = require("./api/routes/legacyCloudCoverageRouter");
  //var legacyCloudMotionRouter   = require("./api/routes/legacyCloudMotionRouter");

  viewer = route();
  app.use("/cloudtrackinglivestream", viewer);
  app.use("/weatherData", weatherDataRouter);
  app.use("/powerPredictions", powerPredictionsRouter);
  app.use("/cloudCoverageData", cloudCoverageDataRouter);

  //app.use("/cloudData", cloudDataRouter);
  //app.use("/cloudCoverage", legacyCloudCoverageRouter);
  //app.use("/cloudMotion", legacyCloudMotionRouter);
}


// I couldn't figure out how to get this to work. The idea was to send an 
// email alert to a specified email whenever an anomaly is detected in the
// database. 
// This is a good area for future work.
async function initEmailer() {

//   const toEmail = require("./config/emailAddressForAnomalyReports");
//   const mailOptions = {
//     from:    "ouc.sdproj.2019.2020@gmail.com",
//     to:      toEmail,
//     subject: 'test',
//     text:    'testing text'
//   };

//   const transporter = nodemailer.sendmail;
//   const transporter = nodemailer.createTransport({
//     service: 'SMTP',
//     auth2
//       user: "ouc.sdproj.2019.2020@gmail.com",
//       pass: "oucIsTheBestSponsor1!A"
//     }
//   });

//   const transporter = nodemailer.createTransport({
//     port: 3000,
//     host: 'localhost',
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
// 
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log("email error:");
//       console.log(error);
//       console.log(" ");
//     } else {
//       console.log("email sent: " + info.response);
//     }
//   });
}

function pushData (toWho, data) {
  if (!viewers[toWho]) {
    return
  }
  viewers[toWho].forEach(function each(client) {
    if (client.readyState === webSocket.OPEN) {
      client.send(data);
    }
  });
};

function init() {
  app.use(cors()); // as mentioned above, this line where cors is set up allows the backend to respond to the frontend
  app.use(bodyParser.json()); // automatically parse POST bodies assuming they're JSON
  require('./databaseConnection'); // run the database connection script
  initChannels(); // sets up for livestreams
  init_routes(); // sets up API urls
  //initEmailer(); // sets up anomaly-email-alert service

  /// todo: viewers = { }

  // viewerServer.on("connection", function connection(ws, req) {
  //   const location = url.parse(req.url, true);
  //   addValueToList(location.pathname.substring(1), ws);
  // });

  streamServer.on("upgrade", (req, socket, head) => {
    const pathname = url.parse(req.url).pathname;
    viewSrv = channels[pathname]; // local scope pls
    if (!viewSrv) {
      console.log("[error] viewer tried to access invalid strm path " + pathname);
      return
    }
    viewSrv.handleUpgrade(req, socket, head, function done(ws) {
      viewSrv.emit("connection", ws, req);
    });
  });

  socketio.on('connection', (client) => {
    console.log('Client Connected');
    
    client.on('coverage', (frame) => {
      console.log('coverage received');
      client.broadcast.emit('coverage', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('shadow', (frame) => {
      console.log('shadow received');
      client.broadcast.emit('shadow', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('coverage27', (frame) => {
      console.log('coverage27 received');
      client.broadcast.emit('coverage27', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('shadow27', (frame) => {
      console.log('shadow27 received');
      client.broadcast.emit('shadow27', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('coverage28', (frame) => {
      console.log('coverage28 received');
      client.broadcast.emit('coverage28', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('shadow28', (frame) => {
      console.log('shadow28 received');
      client.broadcast.emit('shadow28', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('coverage29', (frame) => {
      console.log('coverage29 received');
      client.broadcast.emit('coverage29', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('shadow29', (frame) => {
      console.log('shadow29 received');
      client.broadcast.emit('shadow29', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('coverage33', (frame) => {
      console.log('coverage33 received');
      client.broadcast.emit('coverage33', "data:image/png;base64,"+ frame.toString("base64"))
    })
    client.on('shadow33', (frame) => {
      console.log('shadow33 received');
      client.broadcast.emit('shadow33', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('coverage38', (frame) => {
      console.log('coverage38 received');
      client.broadcast.emit('coverage38', "data:image/png;base64,"+ frame.toString("base64"))
    })
    client.on('shadow38', (frame) => {
      console.log('shadow38 received');
      client.broadcast.emit('shadow38', "data:image/png;base64,"+ frame.toString("base64"))
    })

    client.on('coverage40', (frame) => {
      console.log('coverage40 received');
      client.broadcast.emit('coverage40', "data:image/png;base64,"+ frame.toString("base64"))
    })
    client.on('shadow40', (frame) => {
      console.log('shadow40 received');
      client.broadcast.emit('shadow40', "data:image/png;base64,"+ frame.toString("base64"))
    })
  });

/*
  socketio.on("connection", (req, socket, head) => {
    const pathname = url.parse(req.url).pathname
    client = channels[pathname]
    if(!client){
      console.log("[error] client tried to access invalid client path" + pathname)
      return
    }
    client.on('coverage', (frame) => {
      client.pushData.emit('coverage', "data:image/png;base64," + frame.toString("base64"))
    })
    client.on('shadow', (frame) => {
      client.pushData.emit('shadow', "data:image/png;base64" + frame.toString("base64"))
    })
  })
*/

  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, "Front_End/build")));
  // Handles any requests that don't match the ones above
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/Front_End/build/index.html"));
  });

  //const port = process.env.PORT || 3000;
  //app.listen(port);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  streamServer.listen(port, function () {
    console.log("App is listening on port " + port);
  });
  
}
init();
