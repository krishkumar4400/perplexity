import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Chat content can't be empty"],
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: {
      type: String,
      enum: ["AI", "User"],
    },
  },
  {
    timestamps: true,
  },
);

const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default messageModel;
