const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");
const fs = require("fs");
const { setgroups } = require("process");
let url = "https://pv-data.janphilipps.xyz/cm?cmnd=status%208";

let settings = { method: "Get" };

app.use(cors());
app.use(express.json());

let data = {};

function fetchstats() {
  try {
    fetch(url, settings)
      .then((res) => res.json())
      .then((json) => {
        data = json;
      });
  } catch (e) {
    console.log(e);
  }
}
// function fetchdata() {
//   var obj = JSON.parse(fs.readFileSync("data.json", "utf-8"));
//   console.log(obj);
// }
function safedata() {
  var obj = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  try {
    newobj = {
      date: data.StatusSNS.Time,
      ewe: data.StatusSNS.EWE,
      pv: data.StatusSNS.PV,
    };
    obj.push(newobj);
    console.log(obj);
    fs.writeFileSync("data.json", JSON.stringify(obj));
  } catch (e) {
    console.log(e);
  }
}
let filedata = [];
function postData() {
  filedata = JSON.parse(fs.readFileSync("data.json", "utf-8"));
}
app.get("/datastorage", (req, res) => {
  res.json(filedata);
});
app.get("/data", (req, res) => {
  res.json(data);
});

var fetchInterval = 5000;
var safeInterval = 500000; // 5000000 = alle 1,38h

setInterval(fetchstats, fetchInterval);
setInterval(postData, fetchInterval);
setInterval(safedata, safeInterval);

fetchstats();
postData();
safedata();
app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
