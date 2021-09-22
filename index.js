import express from 'express';
import { fileURLToPath } from 'url'
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import Handlebars from 'handlebars';
import exphbs from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import csurf from 'csurf';
import mongoose from 'mongoose';

import { default as connectMongoDBSession } from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);


import { default as varMiddleware } from './middleware/variables.js';
import { default as userMiddleware } from './middleware/user.js';

import { router as homeRouter } from './routes/home.js';
import { router as authRouter } from './routes/auth.js';

import { default as keys } from './keys/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

let store = new MongoDBStore({
  uri: keys.MONGODB_URI,
  collection: 'session'
})

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(csurf());
app.use(flash());

app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
