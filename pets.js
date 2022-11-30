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
      writeFile("./pets.json", JSON.stringify(pets), (error) =>{
        if (error) {
          console.log('Something went wrong');
        } else {
          console.log('done')
        }
      })
    })
  };

//================================================ no commands ========================================================================================
} else{
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}