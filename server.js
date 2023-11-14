const express = require("express");
const app = express();

const totalMoney = "4000";
let testMoney = "0";

//Use express.json middleware to parse JSON requests
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send(testMoney);
});

app.post("/testapi", (req, res, next) => {
  const money = req.body.money;
  if (money === undefined) {
    res.status(404).send('Money is required');
  } else {
    testMoney = money;
    res.status(201).send(`Money is now ${testMoney}`);
  }
});

app.listen(3000, () => {
  console.log("Listening on port https://localhost:3000");
});
