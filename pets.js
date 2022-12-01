#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

const subcommand = process.argv[2];

//====================================================== read subcommand ==============================================================================
if (subcommand === "read"){
  const petIndex = process.argv[3];

  readFile("./pets.json","utf-8").then((text)=>{
    const pets = JSON.parse(text);
    if (petIndex === undefined){
      console.log(pets);
    } else{
      console.log(pets[petIndex]);
    }
  })
  .catch((e) => {
    console.error("Could not find pets.json. Does it exist?");
  });

//====================================================== create subcommand ============================================================================
} else if (subcommand === "create"){
  const age = process.argv[3];
  const kind = process.argv[4];
  const name = process.argv[5];

  if (age === undefined || kind === undefined || name === undefined){
    console.log('Please enter all three arguments: age, kind, name (separated by a space for each)');
  } else{
    const newPet = {"age": Number(age), "kind": kind, "name":name};
    readFile("./pets.json","utf-8").then((text)=>{
      const pets = JSON.parse(text);
      pets.push(newPet);
      writeFile("./pets.json", JSON.stringify(pets)).then((error) =>{
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log('Pet recorded in our database.')
        }
      })
    })
  }

//================================================ update subcommand ==================================================================================
  } else if (subcommand === "update"){
    const index = process.argv[3];
    const age = process.argv[4];
    const kind = process.argv[5];
    const name = process.argv[6];

    if (index === undefined || age === undefined || kind === undefined || name === undefined){
      console.log('Please enter all four arguments: index, age, kind, name (separated by a space for each)');
    } else{
      readFile("./pets.json","utf-8").then((text)=>{
        const pets = JSON.parse(text);
        const updatedPet = {age, kind, name};
        pets[index]= updatedPet;
        writeFile("./pets.json", JSON.stringify(pets)).then((error) =>{
          if (error) {
            console.log('Something went wrong: ', error);
          } else {
            console.log(`Updated pet at: ${index}`)
          }
        })
      })
    }

//================================================ destroy subcommand ==================================================================================
} else if (subcommand === "destroy"){
  const index = process.argv[3];

  if (index === undefined){
    console.log('Please enter the index you want to remove the record of');
  } else{
    readFile("./pets.json","utf-8").then((text)=>{
      const pets = JSON.parse(text);
      pets.splice(index, 1);
      writeFile("./pets.json", JSON.stringify(pets)).then((error) =>{
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log(`Removed pet at index: ${index}`)
        }
      })
    })
  }

//================================================ no commands ========================================================================================
} else{
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}
