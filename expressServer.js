import express from "express";
import { readFile, writeFile } from "node:fs/promises";

const server = express();
const port = 3000;
function c(x) { console.log(x)}; // robin's console.log shortcut

server.use(express.json());

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

server.post("/pets", (req, res) => {
  const pet = req.body;
  if (Object.keys(pet).length === 3){
    if ('age' in pet && 'kind' in pet && 'name' in pet){ // PASS: age, kind, and name are the keys
      pet.age = Number(pet.age);
      if (isNaN(pet.age) || pet.age === '' || pet.kind === '' || pet.name === ''){ // FAIL: see else statement; wonder why pet.age === NaN didn't work
        res.status(400).send("Bad request, noob")



      } else{ // PASS: age is not NAN, age is not blank, kind is not blank, or name is not blank
        readFile("./pets.json", "utf-8").then((text)=>{
          const pets = JSON.parse(text);
          pets.push(pet);
          writeFile("./pets.json", JSON.stringify(pets)).then((error) =>{
            error ? c("Something went wrong: ", error) : c('Pet recorded in our database: ', pet);
            res.json(pet);
          })
        })
      }



    } else{ // FAIL: age, kind, and name are NOT the keys
      res.status(400).send("Bad request, noob")
    }
  } else{ // FAIL: more or less than 3 entries
    res.status(400).send("Bad request, noob")
  }
  // readFile("./pets.json", "utf-8").then((text)=>{
  //   const pets = JSON.parse(text);
  //   pets.push(pet);
  //   writeFile("./pets.json", JSON.stringify(pets), (error)=>{
  //     error ? res.send(error) : res.json(pets);
  //   })
  // })
  // const info = req.params.info;
  // c(req.body);

  // const infoSep = (info.split(' '));
  // for (let i = 0; i<infoSep.length; i++){
  //   infoSep[i] = infoSep[i].split('=');
  // }
  // const pet = Object.fromEntries(infoSep); // c(Object.keys(pet).length);
  // req.body = pet;
  // c(req.body);
  // if (Object.keys(pet).length === 3){
  //   if ('age' in pet && 'kind' in pet && 'name' in pet){ // PASS: age, kind, and name are the keys
  //     pet.age = Number(pet.age);
  //     if (isNaN(pet.age) || pet.age === '' || pet.kind === '' || pet.name === ''){ // FAIL: see else statement; wonder why pet.age === NaN didn't work
  //       res.status(400).send("Bad request, noob")
  //     } else{ // PASS: age is not NAN, age is not blank, kind is not blank, or name is not blank
  //       readFile("./pets.json", "utf-8").then((text)=>{
  //         const pets = JSON.parse(text);
  //         pets.push(pet);
  //         writeFile("./pets.json", JSON.stringify(pets)).then((error) =>{
  //           error ? c("Something went wrong: ", error) : c('Pet recorded in our database: ', pet);
  //           res.json(pet);
  //         })
  //       })
  //     }
  //   } else{ // FAIL: age, kind, and name are NOT the keys
  //     res.status(400).send("Bad request, noob")
  //   }
  // } else{ // FAIL: more or less than 3 entries
  //   res.status(400).send("Bad request, noob")
  // }
})

server.listen(port, ()=>{
  console.log("Listening on port ", port);
})