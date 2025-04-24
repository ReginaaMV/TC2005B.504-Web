import express from "express";
import indexRoutes from "./routes/index.js";



const app=express();

// app.get("/", (req,res)=> res.send("Hola desde la Api 2"));
// app.get("/ping",(req,res)=>res.send("PONG!"));
// app.get("/marco", (req,res)=>res.send("POLO!"));
// app.get("/a/b/c",(req,res)=>res.send("ABC!"));

const port=5000;
app.listen(port, console.log("http://localhost:"+port));