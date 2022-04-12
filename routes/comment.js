//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Declaring Constants!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Comments = require('../models/commentSchema');
const User = require('../models/userSchema');
const express = require('express');
const router = express.Router();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Get requests ~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/comments', async (req, res) => {
    try {
        const comments = await Comments.find({});

        return res.json({
            success: true,
            comments
        })
    } catch (err) {
        return res.json({ success: false, message: "An error occurred while fetching comments" });
    }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Delete Requests ~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.delete('/comment', async function (req, res) {
    const { commentId } = req.body;

    if (!req.session.user) return res.json({ success: false, message: 'You can\'t delete a comment while signed out' });

    const user = await User.findById(req.session.user);

    if (user) {

    try {
            const commentToDelete = await Comments.findById(commentId);

            if (!commentToDelete) return res.json({ success: false, message: 'Comment doesn\'t exist' });

            if (user.isAdmin !== true && commentToDelete.author !== req.session.user ) return res.json({ success: false, message: 'You didn\'t author this comment' });

            await commentToDelete.remove();

            return res.json({
                success: true,
                message: 'Comment deleted'
            })
        } catch (err) {
            return res.json({ success: false, message: "An error occurred" });
        }
    } else {
        return res.json({success: false, message: "User not found"})
    }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Post Requests ~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post('/submit', async (req, res) => {
    const { text } = req.body;

    if (!req.session.user) return res.json({ success: false, message: 'You must be logged in to contribute' });

    const user = await User.findById(req.session.user);

    if (!user)  return res.json({ success: false, message: 'You must be logged in to contribute' });
    if (!text) return res.json({ success: false, message: 'Please add some text to your comment' });

    try {
        const newComment = new Comments({
            userId: req.session.user,
            text: text,
            username: user.username,
            date: Date.now()
        });

        await newComment.save();

        res.json({
            success: true,
            comment: newComment
        })
    } catch (err) {
        return res.json({ success: false, message: err.toString() });
    }
});


module.exports = router;