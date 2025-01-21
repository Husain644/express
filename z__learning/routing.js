// Routing refers to how an application’s endpoints (URIs) respond to client requests.
import express from 'express'
const app = express()
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
  })
// POST method route
app.post('/', (req, res) => {
    res.send('POST request to the homepage')
  })

// For all route (is pr sabhi request ayengi get post patch put jo )
app.all('/secret', (req, res, next) => {
    console.log('Accessing the secret section ...')
    next() // pass control to the next handler
  })
// pass params to urls
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)  
})  
// console.log(req.param)=> {"userId": "20","bookId": "25"}
// Now send data using url -- http://localhost:8000/users/:20/books/:25

//Add authentication to routing 
app.get('/login',auth,(req,res)=>{res.send('login successully')})
const auth=(req,res,next)=>{if(req.body.pass==='pass123'){next()}}
// A combination of independent functions and arrays of functions can handle a route. For example.
const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from D!')
})
//use Router to Routing  Best Way to routing
export const loginRouter=express.Router
loginRouter
.get('/login/:id',login)
.post('login',saveLogin)
.updateLogin('login',update)
app.use('/user',loginRouter)


  