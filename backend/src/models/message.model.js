import mongoose from "mongoose";
import { AvailableMessageRoles, MessageRoleEnum } from "../utils/constants.js";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat id is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    role: {
      type: String,
      enum: AvailableMessageRoles,
      default: MessageRoleEnum.USER,
    },
  },
  {
    timestamps: true,
  },
);

const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default messageModel;
