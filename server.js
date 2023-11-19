import express from "express";
import { JSONPreset } from "lowdb/node";

const app = express();

// Create and/or read database
const defaultData = { envelopes: [] };
const db = await JSONPreset("db.json", defaultData);
// Deconstructing assignment 
const { envelopes } = db.data;

//Use express.json middleware to parse JSON requests
app.use(express.json());

// This will get all envelopes in an array as it is right now
app.get("/envelope", async (req, res, next) => {
  // Sort function to sort envelopes based on ascending ID order
  const sortId = (a, b) => {
    return a.id - b.id;
  };
  //reads the db.json files
  await db.read();
  // Sorts the database based on the ascending ID
  const dbEnvelopes = db.data.envelopes.sort(sortId);
  res.status(200).send(dbEnvelopes);
});

// This will look for an envelope depending on the specific ID
app.get("/envelope/:id", async (req, res, next) => {
  const id = req.params.id;

  if (id === undefined) {
    res.status(400).send("Provide ID please");
  }

  await db.read();
  //Finds specific entry in the database based on the ID
  const findEnvelopeWithId = envelopes.find(
    (envelope) => envelope.id == Number(id)
  );

  if (!findEnvelopeWithId) {
    res.status(404).send("Envelope not found");
  } else {
    const { id, title, budget } = findEnvelopeWithId;
    res.status(200).send({ id, title, budget });
  }
});

// Creates a new envelope and pushes it into an array
app.post("/envelope", async (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const budget = req.body.budget;

  // Creates new object based on the things in the body
  const newEnvelope = { id, title, budget };

  if (id === undefined || title === undefined || budget === undefined) {
    res.status(400).send("Missing information, try again");
  }

  envelopes.push(newEnvelope);
  await db.write(); // Write to the database
  res.status(201).send(newEnvelope);
});

// Transfer budget from one envelope to another
app.post("/envelope/transfer/:fromId/:toId", async (req, res, next) => {
  const fromId = req.params.fromId;
  const toId = req.params.toId;
  const amount = req.body.amount;

  //Find the from and to envelope
  const findFromEnvelope = envelopes.find((envelope) => envelope.id == fromId);
  const findToEnvelope = envelopes.find((envelope) => envelope.id == toId);

  if (findFromEnvelope === undefined || findToEnvelope === undefined) {
    res.status(400).send("Please provide proper IDs");
  } else {
    findFromEnvelope.budget -= amount;
    findToEnvelope.budget += amount;
    await db.write();
    res
      .status(200)
      .send(`${findFromEnvelope.title} is now ${findFromEnvelope.budget}`);
  }
});

// Update budget inside of an envelope
app.put("/envelope/:id", async (req, res, next) => {
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
    await db.write();
    res.status(201).send(findEnvelopeWithId);
  }
});

// Delete a specific envelope
app.delete("/envelope/:id", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  await db.read();
  const index = envelopes.findIndex((envelope) => envelope.id === id);

  if (index === -1) {
    res.status(400).send("Envelope not found");
  } else {
    db.data.envelopes.splice(index, 1);
    await db.write();
    res.status(204).send(`Envelope with id ${id} deleted`);
  }
});

app.listen(3000, () => {
  console.log("Listening on port localhost:3000");
});
