const express = require("express");
const cors = require("cors");
const app = express();
const fetch = require("node-fetch");

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
        console.log(json);
        data = json;
      });
  } catch (e) {
    console.log(e);
  }
}

app.get("/data", (req, res) => {
  res.json(data);
});

var fetchInterval = 5000;

setInterval(fetchstats, fetchInterval);

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
