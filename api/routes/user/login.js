import express from 'express'
import passport from 'passport';

const router = express.Router();

router.post('/', (req, res) => {
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
