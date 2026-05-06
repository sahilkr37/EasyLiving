import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema({

    elderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    latitude: {
        type: Number,
        required: true
    },

    longitude: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "ACTIVE"
    }

}, { timestamps: true });

const SOSAlert =
    mongoose.models.SOSAlert ||
    mongoose.model("SOSAlert", sosAlertSchema);

export default SOSAlert;