import http from "node:http";
import { readFile } from "node:fs/promises"

const server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/;

//=========================================================== /pets ===================================================================================

  if (req.method === "GET" && req.url === "/pets"){
    readFile("./pets.json", "utf-8").then((text) =>{
      res.setHeader("Content-Type", "application/json");
      res.end(text);
    })

//=========================================================== /pets/index== ===========================================================================

  } else if (req.method === "GET" && (req.url).startsWith("/pets/")){
    let index = (req.url).substring(6);
    console.log(index);
    if (index != undefined){
    readFile("./pets.json", "utf-8").then((text) =>{
      res.setHeader("Content-Type", "application/json");
      // console.log(typeof(text));
      const petsParsed = JSON.parse(text);
      console.log(petsParsed[index]);// gotta re-convert to string?
      const petAtIndexString = JSON.stringify(petsParsed[index]);
      res.end(petAtIndexString);
    })
    } else{

    }

//=========================================================== anything else ===========================================================================
  } else{
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 404;
    res.end("Not Found");
  }
})
server.listen(3000, () => {
  console.log("Server running on port 3000");
})