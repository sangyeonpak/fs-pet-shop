import express from "express";
import { readFile, writeFile } from "node:fs/promises";

const server = express();
const port = 3000;
function c(x) { console.log(x)};

server.get("/", (req, res) => {
  res.status(404).send("Not Found")
});

server.get("/pets", (req, res) => {
  readFile("./pets.json", "utf-8").then((text)=>{
    // res.set("Content-Type", "application/json");
    // res.status(200);
    // res.send(text);
    res.set("Content-Type", "application/json").status(200).send(text);
  })
});

server.get("/pets/:index", (req, res) => {
  const index = req.params.index;
  readFile("./pets.json", "utf-8").then((text) =>{
    const pets = JSON.parse(text);
    const selectedPet = pets[index];
    if (selectedPet != undefined){
      res.status(200).json(selectedPet);
    } else{
      res.status(404).send("Not Found");
    }
  })
});

server.post("/pets%20:info", (req, res) => {
  const info = req.params.info;
  c(info);
  const infoSep = (info.split(' '));
  c(infoSep);
  for (let i = 0; i<3; i++){
    infoSep[i] = infoSep[i].split('=');
  }
  const pet = Object.fromEntries(infoSep);
  c(pet);
  // c(infoSep);
  // const pet = { 'age':Number(age), 'kind':kind, 'name':name };
  // console.log(pet);

  // c(urlParams);
  // readFile("./pets.json", "utf-8").then((text) =>{
  //   const pets = JSON.parse(text);
  //   pets.push(pet);
  //   writeFile("./pets.json", pets).then((err)=>{
  //     err ? c('Something went wrong: ', err) : c('Pet recorded in our database!')
  //   })
  // })
  // res.send(petRegExp.exec())
})

server.listen(port, ()=>{
  console.log("Listening on port ", port);
})