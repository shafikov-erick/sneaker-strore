const {Router} = require('express');

const router = Router();

router.post('/createSneaker' ,async (req, res)=>{
    console.log('createsneker post')
    res.send('post is working');
})

router.get('/createSneaker' ,async (req, res)=>{
    console.log('createsneker get');
    res.send('post is working');
})

module.exports = router;