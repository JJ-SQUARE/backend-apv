import generarJWT from "../helpers/JWTGenerator.js";
import Veterinario from "../models/Veterinario.js";
import idGenerator from "../helpers/idGenerator.js";

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
    const { veterinario } = req;
    res.json({ perfil: veterinario })
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
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVet = await Veterinario.findOne({email});
    if(!existeVet) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVet.token = idGenerator();
        await existeVet.save();
        res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)
    }

    console.log(email)
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    console.log(token)
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        res.json({msg: "Token Válido, el usuario existe"})
    } else {
        const error = new Error('Token no Válido');
        return res.status(400).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const veterinario = await Veterinario.findOne({ token })

    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        console.log(veterinario);
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg:"password modificado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

export {
    registrar,
    perfil,
    confirmar, 
    autenticar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword
}