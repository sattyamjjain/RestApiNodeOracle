const express = require('express');
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) =>{
    res.json({message:"Welcome"})
})

require('./app/routes/user.routes')(app);

app.listen(4000,()=>{
    console.log("Server is running on port 4000")
})