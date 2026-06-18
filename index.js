const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectBD = require("./config/db");
const userRoute = require('./routes/user.route')

dotenv.config()
const app = express();
connectBD();
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://front-node-five.vercel.app"
  ]
}));
const PORT = process.env.PORT;
app.listen( PORT , () => {
    console.log(`serveur démarré sur http://localhost:${PORT}` );
})

// ---------------les routes ----------

// inscription et connexion
app.use('/api/auth'  , userRoute);
app.get('/' , (req , res) => {
    res.send('Bienvenue sur mon serveur')
})