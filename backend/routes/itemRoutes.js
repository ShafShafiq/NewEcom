const express= require('express');
const router = express.Router();
const {addItem,getAllItems,getUserItems,deleteItem,updateItem , searchItems} = require('../controllers/itemcontroller');
const auth = require('../middleware/authmiddleware');
const sellerauth = require('../middleware/sellerAuth');

router.post('/addItem',sellerauth,addItem);
router.get('/items', getAllItems);
router.get('/userItems',auth,getUserItems);
router.delete('/deleteItem/:id',auth,deleteItem);
router.put('/updateItem/:id',auth,updateItem);
router.get('/searchItems',searchItems);
module.exports = router; 