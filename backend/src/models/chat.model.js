import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true
});

const chatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default chatModel;
