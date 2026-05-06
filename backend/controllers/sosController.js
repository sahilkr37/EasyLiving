import SOSAlert from "../models/SOSAlert.js";
import User from "../models/User.js";

export const triggerSOS = async (req, res) => {

    try {

        const elderId = req.user.id;

        const { latitude, longitude } = req.body;

        // 🔥 save SOS
        const sos = await SOSAlert.create({
            elderId,
            latitude,
            longitude
        });

        // 🔥 get elder info
        const elder = await User.findById(elderId);

        res.json({
            success: true,
            message: "SOS triggered successfully",
            sos,
            elderName: elder.name
        });

    } catch (err) {

        console.error("SOS Error:", err);

        res.status(500).json({
            success: false,
            message: "Failed to trigger SOS"
        });
    }
};

export const getActiveSOS = async (req, res) => {

    try {

        const caretakerId = req.user.id;

        // 🔥 find elders connected to caretaker
        const elders = await User.find({
            caretakerIds: { $in: [caretakerId] }
        });

        const elderIds = elders.map(e => e._id);

        // 🔥 find active SOS
        const sosAlerts = await SOSAlert.find({
            elderId: { $in: elderIds },
            status: "ACTIVE"
        }).sort({ createdAt: -1 });

        // 🔥 attach elder info
        const result = await Promise.all(

            sosAlerts.map(async (alert) => {

                const elder = await User.findById(alert.elderId);

                return {
                    _id: alert._id,
                    elderName: elder?.name || "Unknown",
                    latitude: alert.latitude,
                    longitude: alert.longitude,
                    createdAt: alert.createdAt
                };
            })
        );

        res.json(result);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Failed to fetch SOS alerts"
        });
    }
};
export const resolveSOS = async (req, res) => {

    try {

        const { sosId } = req.params;

        await SOSAlert.findByIdAndUpdate(

            sosId,

            {
                status: "RESOLVED"
            }
        );

        res.json({
            success: true,
            message: "SOS resolved successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to resolve SOS"
        });
    }
};