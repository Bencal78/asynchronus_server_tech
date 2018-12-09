import express = require("express");
import { MetricsHandler, Metric } from "./metrics";
import bodyparser = require("body-parser");
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
import { LevelDb } from "./leveldb";
import path = require('path')

const dbPath: string = './db_test'
const db = LevelDb.open(dbPath);

const dbUser: UserHandler = new UserHandler(db)

const app = express();
const port: string = process.env.PORT || "8080";

const dbMet: MetricsHandler= new MetricsHandler(db);

const LevelStore = levelSession(session)



app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.use(function (req: any, res: any, next: any) {
  next()
})

const router = express.Router()

app.use(morgan('dev'))

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('views', path.join(__dirname, '../', 'views'))
app.set('view engine', 'ejs')

app.use('/', express.static(path.join(__dirname, '../node_modules/jquery/dist')))
app.use('/', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')))

/*
  Authentication
*/

const authRouter = express.Router()

authRouter.get('/login', function(req: any, res: any){
  res.render('login')
})

authRouter.post('/login', function(req: any, res: any, next: any){
  let redi = false;
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) console.log(err)
    if (!(result === undefined || !result.validatePassword(req.body.password))) {
      redi = true;
      req.session.loggedIn = true
      req.session.user = result
    }
    redi? res.redirect('/') : res.redirect('/login');
  })
})

authRouter.get('/signup', function(req: any, res: any){
  res.render('signup')
})

authRouter.get('/logout', function(req: any, res: any){
  if(req.session.loggedIn){
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('login')
})

app.use(authRouter)

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}
/*
  User
*/

const userRouter = express.Router()

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, (err: Error | null, result?: User) => {
    if(err || result === undefined){
      res.status(404).send("user not found")
    }
    else res.status(200).json(result)
  })
})

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function(err: Error | null, result?: User){
    if(!err || result !== undefined){
      res.status(409).send("user already exists")
    }
    else {
      dbUser.save(req.body, function(err: Error | null){
        if(err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.post('/update/:username', (req: any, res: any, next: any) => {
  let username = req.params.username;
  dbUser.update(username, req.body, function(err: Error | null, result?: User) {
    if(err) next(err);
    res.status(200).send();
  });
});

userRouter.delete("/:username", function(req: any, res: any, next: any) {
  dbUser.delete(req.params.username, function(err: Error | null) {
    if (err) next(err);
    res.status(200).send();
  });
});



app.use('/user', userRouter)

/*
  Root
*/

app.get("/", authCheck, (req: any, res: any) => {
  res.render("index", { name: req.session.username });
});

app.get("/update_metrics", authCheck, (req: any, res: any) => {
  res.render("update_metrics",  { name: req.session.username });
});

/*
  Metrics
*/

const metricsRouter = express.Router();

// send query as parameter for id because id can be unspecified
metricsRouter.get("/", (req: any, res: any, next: any) => {
  let username = req.session.user.username
  let id = req.query.id? req.query.id : "";
  dbMet.get(id, username, (err: Error | null, result?: Metric[]) => {
      if (err) next(err);
      if (result === undefined) {
        res.write("no result");
        res.send();
      } else{
        res.status(200).json(result);
      }
    }
  );
});

metricsRouter.post('/', (req: any, res: any, next: any) => {
  let username = req.session.user.username;
  let id = Number(Math.random() * 1000).toString();
  let data = req.body
  if(!Array.isArray(req.body)){
    data = [{
      "timestamp": new Date(req.body.date).valueOf(),
      "value": req.body.value
    }]
  }
  dbMet.save(id, username, data, (err: Error | null) => {
    if(err) next(err)
    res.status(200).send()
  })
  res.redirect('/')
});

metricsRouter.post('/update', (req: any, res: any, next: any) => {
  let username = req.session.user.username;
  let id = req.query.id? req.query.id : "";
  let data = req.body;
  dbMet.update(id, username, data, (err: Error | null, result?) => {
    if(err) next(err)
    res.status(200).send()
  })
  res.redirect('/')
});

metricsRouter.delete("/", function(req: any, res: any, next: any) {
  let username = req.query.username? req.query.username : "";
  let id = req.query.id? req.query.id : "";
  dbMet.delete(id, username, function(err: Error | null) {
    if (err) next(err);
    res.status(200).send();
  });
});


app.use('/metrics', authCheck, metricsRouter)

app.use(function (err: Error, req: any, res: any, next: any) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.get("/", (req: any, res: any) => {
  res.write("Hello world");
  res.send();
});

app.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`Server is listening on port ${port}`);
});
