import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import morgan from "morgan";
import postgres from "postgres";

const sql = postgres({ database: "petshop", username: "sangyeonpak", password: "asdf"});
const server = express();
const port = 3000;
function c(x) { console.log(x)}; // robin's console.log shortcut

server.use(express.json());
server.use(morgan('tiny'));

server.get("/pets", (req, res, next) => {
  sql`SELECT * FROM pets`.then((pets) => {
    res.set("Content-Type", "application/json").status(200).send(pets);
  })
});

server.get("/pets/:id", (req, res, next) => {
  const id = req.params.id;
  sql`SELECT * FROM pets WHERE id=${id}`.then((selectedPet) =>{
    if (selectedPet != undefined){
      res.status(200).json(selectedPet);
    } else{
      res.status(404).send("Not Found");
    }
  })
});

server.post("/pets", (req, res, next) => {
  const pet = req.body;
  const { age, kind, name } = pet;
  // invalid length
  if (Object.keys(pet).length != 3) res.status(400).send("Your request has to be 'age': [age], 'kind': [kind], and 'name': [name].");

  //valid length and has age, kind, name
  if (Number.isInteger(age) && age != '' && kind != '' && name != '') {
    sql`INSERT INTO pets (age, kind, name) VALUES (${age}, ${kind}, ${name}) RETURNING *`.then((result) =>{
      res.status(201).json(result[0]);
    }).catch(next);
  }

  else {
    res.status(400).send("Check your request; you made one or more of the following errors: 1) age has to be a number and can't be blank, 2) kind can't be blank, 3) name can't be blank, 4) You put additional keys or keys other than age, kind, and name");
  }
});

server.patch("/pets/:id", (req, res, next) =>{
  const id = req.params.id;
  const body = req.body;
  const { age, kind, name } = body;
  // async function blah (){
  //   for (let keys in body){
  //     if ((keys === 'age' && Number.isInteger(body.age)) || keys === 'kind' || keys === 'name') {
  //       c(`keys: ${keys}, value: ${body[keys]}, id: ${id}`);
  //       sql`UPDATE pets SET ${keys} = ${body[keys]} WHERE id = ${id}`.then((result) =>{
  //         res.status(201).json(result);
  //       });
  //     }
  //     else res.status(400).send("Check your request; you made one or more of the following errors: 1) age has to be a number and can't be blank, 2) kind can't be blank, 3) name can't be blank, 4) You put additional keys or keys other than age, kind, and name");
  //   }
  // }
  // blah();

  if (age != undefined && Number.isInteger(age)){
    sql`UPDATE pets SET age = ${age} WHERE id=${id} RETURNING *`.then((result) =>{

    });
  }
  if (kind != undefined){
    sql`UPDATE pets SET kind = ${kind} WHERE id=${id} RETURNING *`.then((result) =>{

    });
  }
  if (name != undefined){
    sql`UPDATE pets SET name = ${name} WHERE id=${id} RETURNING *`.then((result) =>{

    });
  }
  let result = sql`SELECT * FROM pets WHERE ID =${id}`.then((result) =>{
    res.status(201).send(result);
  });
  // readFile("./pets.json", "utf-8").then((text)=>{
  //   let pets = JSON.parse(text);
  //   let selectedPet = pets[index];
  //   for (let keys in body){
  //     if ((keys === 'age' && Number.isInteger(body.age)) || keys === 'kind' || keys === 'name') selectedPet[keys] = body[keys];
  //     else res.status(400).send("Bad request, noob")
  //   }
  //   writeFile("./pets.json", JSON.stringify(pets)).then((error) =>{
  //     error ? c("Something went wrong: ", error) : c('Update recorded in our database.');
  //     res.status(200).json(body);
  //   })
  // })
})

server.delete("/pets/:index", (req, res, next) =>{
  const index = req.params.index;
  readFile("./pets.json", "utf-8").then((text)=>{
    let pets = JSON.parse(text);
    let deletedPet = pets[index]
    pets[index] = undefined;
    writeFile("./pets.json", JSON.stringify(pets)).then((error)=>{
      error ? c("Something went wrong: ", error) : c('Deleted from our database.');
      res.status(200).send(deletedPet);
    })
  })
})

server.all('*', (req, res, next)=>{
  res.status(404).send("Bad request bro")
})

server.use((err, req, res, next)=>{
  c(err);
  res.status(500).send("Internal Server Error");
})
server.listen(port, ()=>{
  console.log("Listening on port ", port);
})