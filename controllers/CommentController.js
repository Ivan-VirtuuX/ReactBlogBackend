import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js"

export const addComment = async (req, res) => {
    try {
        const { id, commentText } = req.body

        if (!commentText) {
            return res.json({ message: "Комментарий пуст" })
        }

        const author = await User.findById(req.userId);

        const newComment = new Comment({
            comment: commentText,
            author: author.fullName,
        });

        await newComment.save();

        try {
            await Post.findByIdAndUpdate(id, {
                $push: { comments: newComment },

            })
            await Comment.findByIdAndUpdate(id, {
                $push: { comment: commentText }

            })
        } catch (err) {
            console.log(err);
        }
        res.json(newComment)
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Не удалось отправить комментарий",
        });
    }
}
