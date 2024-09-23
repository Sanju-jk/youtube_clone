import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    //user who is subscribing
    subscriber: {
        type: Schema.Types.ObjectId, 
        ref:"User"
    },
    //user who created channel
    channel: {
        type: Schema.Types.ObjectId, 
        ref:"User"
    }
})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)