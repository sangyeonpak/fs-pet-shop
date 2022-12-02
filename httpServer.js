import http from "node:http";
import { readFile, writeFile } from "node:fs/promises"

const server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/;

//=========================================================== /pets ===================================================================================

// shorthand { method, url } = req; then just type instead of method instead of req.method
  if (req.method === "GET" && req.url === "/pets"){
    readFile("./pets.json", "utf-8").then((text) =>{
      res.setHeader("Content-Type", "application/json");
      res.end(text);
    })

//=========================================================== /pets/ (notice the forward slash) =======================================================

  } else if (req.method === "GET" && (req.url).startsWith("/pets/")){
    let index = (req.url).substring(6);
    console.log(index);

    // if index is defined
    if (index != undefined){
    readFile("./pets.json", "utf-8").then((text) =>{
      res.setHeader("Content-Type", "application/json");
      // console.log(typeof(text));
      const petsParsed = JSON.parse(text);
      console.log(petsParsed[index]);// gotta re-convert to string?
      const petAtIndexString = JSON.stringify(petsParsed[index]);

      // if index results in a match
      if (petAtIndexString != undefined){
        res.end(petAtIndexString);

      // index doesn't result in a match
      } else{
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 404;
        res.end("Not Found");
      }
    })
    // if index is undefined
    } else{
      res.setHeader("Content-Type", "text/plain");
      res.statusCode = 404;
      res.end("Not Found");
    }

//=========================================================== POST ====================================================================================
  } else if (req.method === "POST" && (req.url).startsWith("/pets")){
    const url = req.url;


    // if POST and has all three
    if (url.includes("age=") && url.includes("kind=") && url.includes("name")){
      const ageStart = (url.indexOf("age=")+4);
      const kindStart = (url.indexOf("kind=")+5);
      const nameStart = (url.indexOf("name=")+5);
      // console.log(url[ageStart])
      // console.log(url[kindStart])
      // console.log(url[nameStart])

      if (ageStart === -1 || kindStart === -1 || nameStart === -1){
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 404;
        res.end(`Not Found`)
      } else{
        const ageEnd = (url.indexOf("%20kind="));
        const kindEnd = (url.indexOf("%20name="));
        const nameEnd = (url.length);
        // console.log(url[ageEnd])
        // console.log(url[kindEnd])
        // console.log(url[nameEnd])

        const ageInput = Number(url.substring(ageStart, ageEnd));
        // console.log('age:',ageInput);
        const kindInput = url.substring(kindStart, kindEnd);
        // console.log('kind:', kindInput);
        const nameInput = url.substring(nameStart, nameEnd);
        // console.log('name:', nameInput);


      readFile("./pets.json", "utf-8").then((text) =>{
        res.setHeader("Content-Type", "application/json");
        const petsParsed = JSON.parse(text);
        petsParsed.push({
          'age': ageInput,
          'kind' : kindInput,
          'name' : nameInput
      });
        writeFile("./pets.json", JSON.stringify(petsParsed)).then((error) =>{
          if (error) {
            console.log('Something went wrong: ', error);
          } else {
            console.log('Pet recorded in our database.')
          }
          res.statusCode = 200;
          res.end(`{'age': ${ageInput},'kind' : ${kindInput},'name' : ${nameInput}}`)
        })
      })
    }
  }


//=========================================================== anything else ===========================================================================
  } else{
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 404;
    res.end("Not Found");
  }
}
)
server.listen(3000, () => {
  console.log("Server running on port 3000");
})