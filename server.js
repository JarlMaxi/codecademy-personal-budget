const express = require("express");
const app = express();

const totalMoney = "4000";
let testMoney = "40";

let envelopes = [];

//Use express.json middleware to parse JSON requests
app.use(express.json());

//This is a simple test app.get to ensure it works as intended
app.get("/", (req, res, next) => {
  res.send(testMoney);
});

// This will get all envelopes in an array as it is right now
app.get("/envelope", (req, res, next) => {
  const sortId = (a, b) => {
    return a.id - b.id;
  };
  res.send(envelopes.sort(sortId));
});

// This will look for an envelope depending on the specific ID
app.get("/envelope/:id", (req, res, next) => {
  const id = req.params.id;
  if (id === undefined) {
    res.status(400).send("Provide ID please");
  } else {
    const findEnvelopeWithId = envelopes.find(
      (envelope) => envelope.id == Number(id)
    );
    if (findEnvelopeWithId) {
      const { title, budget } = findEnvelopeWithId;
      res.status(200).send({ id, title, budget });
    } else {
      res.status(404).send("Envelope not found");
    }
  }
});

// Creates a new envelope and pushes it into an array
app.post("/envelope", (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const budget = req.body.budget;

  const newEnvelope = { id, title, budget };

  if (id === undefined || title === undefined || budget === undefined) {
    res.status(400).send("Missing information, try again");
  } else {
    envelopes.push(newEnvelope);
    res
      .status(201)
      .send(
        `Thank you for the ${title.toLowerCase()} envelope with ${budget} USD`
      );
  }
});

// Update budget inside of an envelope
app.put("/envelope/:id", (req, res, next) => {
  const id = req.params.id;
  const newAmount = req.body.budget;

  if (newAmount === undefined || isNaN(newAmount)) {
    res.status(400).send("Please provide valid numbers");
  }

  let findEnvelopeWithId = envelopes.find(
    (envelope) => envelope.id == Number(id)
  );

  if (findEnvelopeWithId === undefined) {
    res.status(400).send("Please provide an ID");
  } else {
    findEnvelopeWithId.budget = newAmount;
    res.status(201).send(findEnvelopeWithId);
  }
});

// Delete a specific envelope
app.delete("/envelope/:id", (req, res, next) => {
  const id = req.params.id;

  const index = envelopes.findIndex((envelope) => envelope.id === id);

  if (!index === -1) {
    res.status(400).send("Envelope not found");
  } else {
    envelopes.splice(index, 1);
    res.status(204).send(`Envelope with id ${id} deleted`);
  }
});

app.listen(3000, () => {
  console.log("Listening on port localhost:3000");
});
