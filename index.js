const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const Note = require('./models/note')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

let notes = [
	{
		id: 1,
		content: 'HTML on helppoa',
		date: '2017-12-10T17:30:31.098Z',
		important: true
	},
	{
		id: 2,
		content: 'Selain pystyy suorittamaan vain javascriptiä',
		date: '2017-12-10T18:39:34.091Z',
		important: false
	},
	{
		id: 3,
		content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
		date: '2017-12-10T19:20:14.298Z',
		important: true
	}
]

/**
 *
 const http = require('http')

const app = http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json'})
	res.end(JSON.stringify(notes))
	}
)
**/
const generateId = () => {
	const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
	return maxId + 1
}

const formatNote = (note) => {
	return {
	  content: note.content,
	  date: note.date,
	  important: note.important,
	  id: note._id
	}
  }

app.get('/', (req, res) => {
	res.send('<h1>hello w</h1>')
})

app.get('/api/notes', (req, res) => {
	Note
    .find({})
    .then(notes => {
      res.json(notes.map(formatNote))
    })
})

app.get('/api/notes/:id', (request, response) => {
	/**
	const id = Number(request.params.id)
	const note = notes.find(note => note.id === id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
	**/
	Note
    .findById(request.params.id)
    .then(note => {
	  if (note) {response.json(formatNote(note))
	} else {
		response.status(404).end()
	}
	})
	.catch(error => {
		console.log(error)
		response.status(400).send({ error: 'malformatted id' })
	})
})

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (body.content === undefined) {
		return res.status(400).json({error: 'content missing'})
	}
/**
	const note = {
		content: body.content,
		important: body.important || false,
		date: new Date(),
		id: generateId()
	}
	notes = notes.concat(note)
	res.json(note)
	**/
	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date()
	  })
	  note
	  .save()
	  .then(formatNote)
	  .then(savedAndFormattedNote => {
		response.json(savedAndFormattedNote)
	  })
	
})

app.delete('/api/notes/:id', (request, response) => {
	/**const id = Number(request.params.id)
	notes = notes.filter(note => note.id !== id)
	response.status(204).end()
	**/
	Note
	.findByIdAndRemove(request.params.id)
	.then(result => {
		response.status(204).end()
	})
	.catch(error => {
		response.status(400).send({error: 'malformatted id'})
	})
})

app.put('/api/notes/:id', (request, response) => {
	const body = request.body
  
	const note = {
	  content: body.content,
	  important: body.important
	}
  
	Note
	  .findByIdAndUpdate(request.params.id, note, { new: true } )
	  .then(updatedNote => {
		response.json(formatNote(updatedNote))
	  })
	  .catch(error => {
		console.log(error)
		response.status(400).send({ error: 'malformatted id' })
	  })
  })

/**
app.get('/note/:id', (req, res) => {
	res.json(notes[req.params.id])
})
**/
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

