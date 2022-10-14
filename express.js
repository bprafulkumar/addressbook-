const express = require('express')
// const mongodb = require('./MongoDbConnection')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

mongoose.connect("mongodb+srv://praful:12345@cluster0.rkcg2wp.mongodb.net/details?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });

const types = new mongoose.Schema ({
    name:String,
    phone: {
        
            type:Number,
            required:[true,'phone number is required'],
            unique:true
       
    },
    email: String,
    address: String
})

const monmodel = mongoose.model("addressbookdetails",types);

app.post("/post",async(req,res)=>{
    try{
        const val =await monmodel.collection.insertOne({
            name:req.body.name,
            phone:req.body.phone,
            email:req.body.email,
            address:req.body.address,
            
        })
        res.json(val);
    }catch(error){
        res.send(error)
        // console.log(error,"An error occured")
    }
})

app.post("/post/bulk",async(req,res)=>{
    try{
        
        const val =await monmodel.collection.insertMany(req.body.data)
        res.json(val);
    }catch(error){
        res.send(error)
        // console.log(error,"An error occured")
    }
})

app.get("/contact/:phone",async(req,res)=>{
    try{
        console.log(req.params.phone,"cekjndcdcm")

        let contactInfo = await monmodel.collection.findOne({phone:Number(req.params.phone)})
       
        console.log(contactInfo,"Contact info")
        res.json(contactInfo);

    }catch(error){
        res.send(error)
        // console.log(error,"An error occured")
    }
})

app.delete("/contact/:phone",async(req,res)=>{
    try{
        console.log(req.params.phone,"cekjndcdcm")

        let contactInfo = await monmodel.collection.deleteOne({phone:Number(req.params.phone)})
       
        res.json({
            Status:'Sucessfully deleted'
        });

    }catch(error){
        res.send(error)
        // console.log(error,"An error occured")
    }
})

app.put("/contact/:phone",async(req,res)=>{
    try{
        console.log(req.params.phone,req.body,"cekjndcdcm")

        // let contactInfo = await monmodel.collection.findOneAndUpdate({phone:Number(req.params.phone)},{name:req.body.name,email:req.body.email,address:req.body.address})
        let doc = await monmodel.collection.findOne({phone:Number(req.params.phone)});

        // Document changed in MongoDB, but not in Mongoose
        await monmodel.collection.updateOne({phone:Number(req.params.phone)}, {name:req.body.name,email:req.body.email,address:req.body.address});
        
        // This will update `doc` age to `59`, even though the doc changed.
        doc.name = req.body.name;
        doc.email =  req.body.email;
        doc.address =  req.body.address;
        await doc.save();
        res.json({
            Status:'Sucessfully updated'
        });

    }catch(error){
        console.log(error,"An error occured")
        res.send(error)
       
    }
})

app.get("/contact/pagination/:limitval",async(req,res)=>{
    try{
        
        console.log(req.params.limitval,req.query.limit,"cekjndcdcm")

        let contactInfo = await monmodel.collection.find({}).limit(Number(req.query.limitval))
       
        console.log(contactInfo,"Contact info")
        res.json(contactInfo);

    }catch(error){
        res.send(error)
        // console.log(error,"An error occured")
    }
})

// app.use('/details',(req,res,next) => {
//     // res.send("<p>Prafulkumar12345</p>")
//     const {name,phoneNumber,email,address} = req.body
    
//     console.log(req.body)
// })




app.listen(3001)

console.log("listen to the server")


