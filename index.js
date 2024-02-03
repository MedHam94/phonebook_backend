const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5001

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateID = () => {
    return Math.floor(Math.random() * 100)
}

const findDuplicate = (persons) => {
    return persons.some(el => el === persons)
}

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length}</p><p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(el => el.id == id)
    if (person === undefined) {
        res.send(`there is no number with the given id`)
    } else {
        res.json(person)
    }
})

app.post('/api/persons', (req, res) => {
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: generateID()
    }
    if (!person.name || !person.number) {
        res.status(404).json('The name or number is missing')
    } else if (findDuplicate(persons)) {
        res.status(404).json({ error: 'already existing number' })
    } else {
        console.log(person);
        res.json(person)
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = +req.params.id

    persons = persons.filter(el => el.id != id)
    res.status(204).send();
}
)

app.listen(PORT, () => {
    console.log('express connected');
})