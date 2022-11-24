import express from 'express'
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: 'Tiberiu',
        token: 'jwiwmc943uwk3-04kdf-3832d,jsowsdnjr',
        rights: 2
    })
})

router.get('/google', (req, res) => {
    res.sendStatus(404)
})

export default router;
