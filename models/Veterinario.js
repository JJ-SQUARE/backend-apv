import mongoose from "mongoose";
import bcrypt from "bcrypt";
import idGenerator from "../helpers/idGenerator.js";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true, // Para eliminar espacios en blanco que se le pongan
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: idGenerator()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre('save', async function(next) {

    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // respeta el password del  usuario y pone un hasheo;
});

veterinarioSchema.methods.comprobarPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password)
};

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;