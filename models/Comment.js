import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            default: ""
        },
        author: {
            type: String,
            default: ""
        },
    }, { timestamps: true },
)

export default mongoose.model("Comment", CommentSchema)