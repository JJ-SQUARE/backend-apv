import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = ['http://127.0.0.1:5173']
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            // El dominio está permitido
            callback(null, true);
            // null: no va a mandar mensaje de  error
            // true: permite el acceso
        } else {
            callback(new Error('Error no permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

// En su archivo de routes se exporta como router solamente, pero acá se importa específicamente como pacienteRoutes o veterinarioRoutes para identificarlo, esto se puede porque el archivo origen usa export default.

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`servidor funcionando en el puerto: ${PORT}`);
});


console.log("desde nodejs")