let dictionary = [];
const express = require("express");
const fs = require("fs");

var app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

/*CORS isn’t enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  res.setHeader("Content-type", "application/json");

  // Pass to next layer of middleware
  next();
});

// GET all users
app.get("/sanakirja", (req, res) => {
  const data = fs.readFileSync("sanakirja.txt", {
    encoding: "utf8",
    flag: "r",
  });
  //data:ssa on nyt koko tiedoston sisältö

  /*tiedoston sisältö pitää pätkiä ja tehdä taulukko*/
  const splitLines = data.split(/\r?\n/);
  /*Tässä voisi käydä silmukassa läpi splitLines:ssa jokaisen rivin*/
  splitLines.forEach((line) => {
    const words = line.split(" "); //sanat taulukkoon words
    const word = {
      fin: words[0],
      eng: words[1],
    };
    dictionary.push(word);
  });

  res.json(dictionary);
});

app.get("/sanakirja/:fin", (req, res) => {
  var hakusana = String(req.params.fin);
  res.json(findEng(hakusana));
});

function findEng(hakusana) {
  var eng = "";
  try {
    // read contents of the file
    const data = fs.readFileSync("sanakirja.txt", "UTF-8");

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // print all lines
    lines.forEach((line) => {
      var temp_1 = line.split(" ");
      var temp_2 = temp_1[0];
      var temp_3 = temp_1[1];
      if (hakusana === temp_2) {
        eng = temp_3;
      }
    });
  } catch (err) {
    console.error(err);
  }
  return eng;
}

function writeLine(fin, eng) {
  var temp = "\r\n" + fin + " " + eng;
  fs.appendFile("sanakirja.txt", temp, (err) => {});
}

// ADD a word
app.post("/sanakirja/lisaa/", (req, res) => {
  const word = req.body;
  var fin = word.fin;
  var eng = word.eng;
  writeLine(fin, eng);
  res.json(word);
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
