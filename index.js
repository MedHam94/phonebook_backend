const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const password = process.argv[2];
const url = process.env.MONGODB_URI;

app.use(cors());

app.use(express.static("dist"));
app.use(express.json());

const Persons = require("./model/person");

// const findDuplicate = () => {
//     return Persons.find({}).then(result =>{
//         console.log(result);
//     }).some(el => el.name ===req.body.name )
// };


app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length}</p><p>${new Date()}</p>`
    );
});

app.get("/api/persons", (req, res) => {
    Persons.find().then((persons) => {
        console.log("persons", persons);
        res.json(persons);
        // mongoose.connection.close();
    });
    // res.json(persons)
});

app.get("/api/persons/:id", (req, res) => {
    //   const id = req.params.id;
    //   const person = persons.find((el) => el.id == id);
    //   if (person === undefined) {
    //     res.send(`there is no number with the given id`);
    //   } else {
    //     res.json(person);
    //   }
    Persons.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ error: 'malformatted id' })
        })
});

app.post("/api/persons", (req, res) => {
    const person = new Persons({
        name: req.body.name,
        number: req.body.number,
        // id: generateID()
    });
    // const existingPerson = Persons.findOne(person.name)
      if (!person.name || !person.number) {
        console.error("The name or number is missing");
        return res.status(400)
      }else{
        person.save().then(savedPerson => {
            res.json(savedPerson)
        }).catch(error => {
          
            console.error("Error saving person:", error);
            res.status(500).json({ error: "Internal server error" });
        });
      }
    //   else if (existingPerson) {
    //     existingPerson.number = person.number
    //     return existingPerson.save().then(updatedPerson =>{
    //         res.json(updatedPerson)
    //     })
    //     res.status(404).json({ error: "already existing number" });

    //   } 


});

app.delete("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;
    Persons.findByIdAndDelete(id)
        .then(result => {
            // const deletedPerson = Persons.findById(id)
            // console.log(deletedPerson);
            res.status(200).end()
        }).catch(err => next(err))

    //   persons = persons.filter((el) => el.id != id);
    //   res.status(204).send();
});

app.put('/api/persons/:id',(req,res)=>{
    const id = req.params.id;
    const person = {
        number:req.body.number
    }

    // console.log('this is put', person);
    Persons.findByIdAndUpdate(id, person,{new:true}).then(updatedNum => {
        res.json(updatedNum)
    })
})

const errorHandler = (error, request, response, next)=>{
    console.log(error.message);
    if(error.name === 'CastError'){
        response.status(404).send({error:'malformed id'})
    }
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`express running on ${PORT}`);
});
