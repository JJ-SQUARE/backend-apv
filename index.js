import express from "express";
import dotenv from "dotenv"

import conectarDB from "./config/db.js";
import veterinarioRroutes from "./routes/veterinarioRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

app.use('/api/veterinarios', veterinarioRroutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`servidor funcionando en el puerto: ${PORT}`);
});


console.log("desde nodejs")