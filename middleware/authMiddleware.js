import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";


const checkAuth = async (req, res, next) => {
    let token;
    const bearerToken = req.headers.authorization;

    if (bearerToken && bearerToken.startsWith('Bearer')) {
        try {
            token = bearerToken.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');

            return next();
        } catch (error) {
            const err = new Error('Token no válido');
            return res.status(403).json({msg: err.message})            
        }
    }

    if (!token) {
        const err = new Error('Token no válido o inexistente');
        res.status(403).json({msg: err.message});
    }

    next();
};

export default checkAuth;