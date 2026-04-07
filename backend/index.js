import express from 'express';


const app = express();
const PORT = 3001;

app.get("/test",(req,res)=>{
    res.json({
        Message:"/test endpoint works"
    })
})


app.listen(PORT, () => {
  console.log(`Server runs successfully `);
});


