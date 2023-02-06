import generarJWT from "../helpers/JWTGenerator.js";
import Veterinario from "../models/Veterinario.js";

const registrar = async (req, res) => {
    const { email } = req.body;

    //  Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}) // email es objeto no destructuring

    if (existeUsuario) {
        console.log(existeUsuario);
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save();

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }
};

const perfil = (req, res) => {
    res.send({msg:"desde perfil vet..."})
};

const confirmar = async (req, res) => {
    const { token } = req.params; // como se nombre aquí es como se va a acceder en el routing
    const usuarioConfirmar = await Veterinario.findOne({token});

    if (!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }

    try {

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: "Usuario confirmado correctamente"})
        
    } catch (error) {
        console.log(error)
    }

    console.log(usuarioConfirmar);

    res.json("confirmando...")
}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({email});

    if (!usuario) {
        const error = new Error("No existe el usuario");
        return res.status(404).json({ msg: error.message });
    }
    
    // Comprobar si el usuario está confirmado
    
    if(!usuario.confirmado) {
        const error = new Error("No ha sido confirmado");
        return res.status(403).json({ msg: error.message });
    }
    
    // Revisar password 
    if (await usuario.comprobarPassword(password)) {
        res.json({token: generarJWT(usuario.id)})
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message})
        
    }

    // Autenticar al usuario



}

export {
    registrar,
    perfil,
    confirmar, 
    autenticar
}