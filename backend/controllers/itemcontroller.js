const item = require('../models/items');
const user = require('../models/users');

exports.addItem = async (req, res) => {
    try {
   
      const { itemName, itemPrice, itemDescription, itemImage, itemOwner } = req.body;
      
        let userexit = await user.findById(req.user.userId)
        console.log(userexit)
        if(!userexit  || userexit.accounttype!="Seller"){
            console.log("here")
            return res.status(400).send({ error:{message: "USER_NOT_FOUND"} });
        }
        else{
            const Item = new item({ itemName, itemPrice, itemDescription, itemImage, itemOwner:userexit._id });
            await Item.save();
            
         
            userexit.ItemsToSell.push(Item._id);
            await userexit.save();
            res.status(201).send({message:"Item Added Successfully",item:Item});
        }
    } catch (error) {
        res.status(400).send({ error:{message:error.message} });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const Items = await item.find();
        res.status(200).send({items:Items});
    } catch (error) {
        res.status(400).send({ error:{message:error.message} });
    }
}
exports.getUserItems =  async (req, res) => {
    try {
        const userId = req.user.userId;
        const Items = await item.find({itemOwner:userId});
        res.status(200).send({items:Items});
    } catch (error) {
        res.status(400).send({ error:{message:error.message} });
    }
}
exports.deleteItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const itemId = req.params.id;
        const Item = await item.findById(itemId);
        
        if (!Item) {
            return res.status(404).send({ error:{message:"ITEM_NOT_FOUND"} });
        }
        if(Item.itemOwner!=userId){
            return res.status(401).send({ error:{message:"UNAUTHORIZED"} });
        }else{
            user.findById(Item.itemOwner).then(user=>{
                user.ItemsToSell.pull(Item._id);
                user.save();
            })
            await Item.deleteOne();
            res.status(200).send({message:"Item Deleted Successfully"});
        }
    }
    catch (error) {
        res.status(400).send({ error:{message:error.message} });
    }
}

//update item
exports.updateItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const itemId = req.params.id;
        const Item = await item.findByIdAndUpdate(itemId ,{$set:req.body});
        if(!Item){
            return res.status(404).send({ error:{message:"ITEM_NOT_FOUND"} });
        }
        if(Item.itemOwner!=userId){
            return res.status(401).send({ error:{message:"UNAUTHORIZED"} });
        }
        res.status(200).send({message:"Item Updated Successfully"});
    }catch(err){
        res.status(400).send({ error:{message:error.message} });
    }
}

//i want to implement the seach  items by name feature
exports.searchItems = async (req, res) => {
    try {
        const search = req.query.search;
        const Items = await item.find({ itemName: { $regex: search, $options: 'i' } });
        res.status(200).send({items:Items});
    } catch (error) {
        res.status(400).send({ error:{message:error.message} });
    }
}