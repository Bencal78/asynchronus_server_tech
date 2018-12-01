import express = require("express");
import { MetricsHandler, Metric } from "./metrics";
import bodyparser = require("body-parser");
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
import path = require('path')

const dbUser: UserHandler = new UserHandler('./db/users')

const app = express();
const port: string = process.env.PORT || "8080";

const dbMet: MetricsHandler= new MetricsHandler("./db/metrics");

const LevelStore = levelSession(session)

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.use(function (req: any, res: any, next: any) {
  //console.log(req.method + ' on ' req.url)
  //next(new Error('error demonstraton'))
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
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    console.log("result :", result)
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      console.log("not ok")
      res.redirect('/login')
    } else {
      console.log("ok login")
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
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
  console.log(req.params.username)
  dbUser.get(req.params.username, (err: Error | null, result?: User) => {
    if(err || result === undefined){
      res.status(404).send("user not found")
    }
    else res.status(200).json(result)
  })
})

userRouter.post('/', (req: any, res: any, next: any) => {
  console.log("body :", req.body)
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

// router.get('/:id', (req: any, res: any, next: any) => {
//   dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
//     if(err) next(err)
//     if(result == undefined) {
//       res.write('no result')
//       res.send()
//     }else res.json(result)
//   })
// })
//
// router.post('/:id', (req: any, res: any, next: any) => {
//   dbMet.save(req.params.id, req.body, (err: Error | null) => {
//     if(err) next(err)
//     res.status(200).send()
//   })
// })

app.get("/", authCheck, (req: any, res: any) => {
  res.render("index", { name: req.session.username });
});

/*
  Metrics
*/

const metricsRouter = express.Router();
metricsRouter.use(function(req: any, res: any, next: any) {
  console.log("called metrics router");
  next();
});

metricsRouter.get("/", (req: any, res: any, next: any) => {
  console.log("params :", req.params)
  console.log("query :", req.query)
  console.log("body :", req.body)
  let username = req.query.username? req.query.username : "";
  let id = req.query.id? req.query.id : "";
  if (req.session.user.username === req.query.username) {
    dbMet.get(id, username, (err: Error | null, result?: Metric[]) => {
        if (err) next(err);
        if (result === undefined) {
          res.write("no result");
          res.send();
        } else res.json(result);
      }
    );
  } else {
    res
      .status(401)
      .send("Vous n'avez pas l'autorisation de lire les metrics d'autrui !");
  }
});

metricsRouter.post('/', (req: any, res: any, next: any) => {
  let username = req.query.username? req.query.username : "";
  let id = req.query.id? req.query.id : "";
  dbMet.save(id, username, req.body, (err: Error | null) => {
    if(err) next(err)
    res.status(200).send()
  })
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

// app.get("/metrics/:id", (req: any, res: any) => {
//   dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
//     if (err) throw err;
//     if (result === undefined) {
//       res.write("no result");
//       res.send();
//     } else res.json(result);
//   });
// });
//
// app.post("/metrics/:id", (req: any, res: any) => {
//   dbMet.save(req.params.id, req.body, (err: Error | null) => {
//     if (err) {
//       res.status(500);
//       throw err;
//     }
//     res.status(200).send();
//   });
// });

app.listen(port, (err: Error) => {
  if (err) throw err;
  console.log(`Server is listening on port ${port}`);
});
