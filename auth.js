import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
    const auth = req.headers.authorization;
    console.log('this is auth --->>' + auth);

    if (!auth) {
        res.status(401).json({ error: 'invalid key' });
    }

    const [, token] = auth.split(' ');

    try {
        console.log('this is token ==>>>>' + token);
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        console.log('this is decoded' + decoded);

        req.userId = decoded.id;// instead of using jwt.verify with a callback fundtion
    } catch (error) {
        console.log(error);       // we promisify it returning the token and secret, this way 
        return res.status(400).json({ error: 'token --- invalid' });// we can use async and await
    }
    return next();
}


