import UserModel from "../models/User.js"


export const getUser = async (req,res) => {
    try {
        const {id} =  req.params
        const user = await UserModel.findById({_id:id})
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}
export const getUserFriends = async (req,res) => {
    try {
        const {id} =  req.params
        const user = await UserModel.findById({_id:id})
        const friends = await Promise.all(user.friends.map(id => UserModel.findById({_id: id})))
        const formattedFriedns = friends.map(({_id, firstName, lastName, occupation,  location, picturePath}) => {
            return {_id, firstName, lastName, occupation,  location, picturePath}
        })
        res.status(200).json(formattedFriedns)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}
export const addRemoveFriend = async (req,res) => {
    try {
        const {id, friendId} = req.params
        if ( id === friendId) {
            return res.status(404).json({error: "You can't add yourself as as a friend"})
        }
        const user = await UserModel.findById({_id:id})
        const friend = await UserModel.findById({_id: friendId})
        
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter(val => val !== friendId)
            friend.friends = friend.friends.filter(val=> val !== id)
        } else {
            user.friends.push(friendId)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()
        const friends = await Promise.all(user.friends.map(id => UserModel.findById({_id: id}))) || []
        const formattedFriedns = friends.map(({_id, firstName, lastName, occupation,  location, picturePath}) => {
            return {_id, firstName, lastName, occupation,  location, picturePath}
        })
        res.status(200).json(formattedFriedns)
    } catch (err) {
        res.status(404).json({error: err.message})
    }
}