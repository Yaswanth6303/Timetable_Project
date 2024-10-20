require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL
const { facultyRouter } = require("./routes/facultyRouter")

const app = express();
app.use(express.json()); 
app.use("/api/v1/faculty", facultyRouter)

async function main(){
    try{
        await mongoose.connect(MONGO_URL)
        console.log("Connected to MongoDB")
    }catch(err){
        console.log(err)
    }
}

main()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
