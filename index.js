const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const bodyParser = require("body-parser");
const { isValidStateAbbreviation } = require("usa-state-validator");
const dotenv = require('dotenv')
dotenv.config();;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get("/customers", async (req, res) => {
  console.log("Attemptinng to GET all customers");

  const { data, error } = await supabase.from("customer").select();

  if (error) {
    console.log("Error: ${error}");
    res.statusCode = 400;
    res.send(error);
  }

  res.send(data);
});

app.post("/customer", async (req, res) => {
  console.log("Adding customer");

  console.log(req.body);
  const fname = req.body.fname;
  const lname = req.body.lname;
  const state = req.body.state;

  if (!isValidStateAbbreviation(state)) {
    console.error("State: ${state} is invalid");
    res.statusCode = 400;
    res.header("Content-Type", "application/json");
    var errorJson = {
      message: "${state} is not a valid state",
    };

    res.send(JSON.stringify(errorJson));
    return;
  }

  const { data, error } = await supabase
    .from("customer")
    .insert({
      customer_fname: fname,
      customer_lname: lname,
      customer_state: state,
    })
    .select();

  if (error) {
    console.log("Error: ${error}");
    res.statusCode = 500;
    res.send(error);
  }
  res.send(data);
});

app.listen(port, () => {
  console.log("App is alive on port " + port);
});
