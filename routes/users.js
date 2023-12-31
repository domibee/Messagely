const Router = require("express").Router;
const User = require("../models/user");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const router = new Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', async (req,res,next)=>{
    try {0
        const results = await User.all()
        ;
        return res.json({users: results.rows })
    } catch (e){
        return next(e)
    }
}) 

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async (req,res,next) => {
    try {
        const results = await User.get(req.params.username);

        return res.json({users: results.rows[0]})

    } catch (e){
        return next(e)
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureLoggedIn, async (req,res,next)=>{
    try {
        const received_messages = await Message.messagesTo(req.params.username);
        return res.json({messages: received_messages.rows})
    } catch (e) {
        return next(e)
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/from', ensureCorrectUser, async(req,res,next)=>{
    try{
        const sent_messages = await Message.messagesFrom(req.params.username);
        
        return res.json({messages: sent_messages.rows})
    }catch(e){
        return next(e)
    }
})


