const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");
let url = "https://pv-data.janphilipps.xyz/cm?cmnd=status%208";
const mysql = require("mysql");
let settings = { method: "Get" };
require("dotenv").config();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
connection.connect((error) => {
  if (error) throw error;
  console.log("Connected to MySQL database!");
});
let data = {};

function fetchstats() {
  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      data = json;
      console.log(data);
      let sql = `INSERT INTO ${process.env.DB_TABLE} (date, ewe, pv) VALUES ('${data.StatusSNS.Time}', '${data.StatusSNS.EWE.curr_w2}', '${data.StatusSNS.PV.curr_w1}')`;
      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
}
function uploadstats() {
  connection.query("SELECT * FROM data", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    filedata = result;
  });
}

app.get("/datastorage", (req, res) => {
  res.json(filedata);
});
app.get("/data", (req, res) => {
  res.json(data);
});

var fetchInterval = 500000;
var safeInterval = 5000; // 5000000 = alle 1,38h

uploadstats();
fetchstats();

setInterval(fetchstats, fetchInterval);
setInterval(uploadstats, fetchInterval);

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
