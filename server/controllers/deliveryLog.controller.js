const DeliveryDistanceLog = require("../models/DeliveryDistanceLog");

exports.createDeliveryLog = async (req, res) => {
    try {
        const { entryDate, distanceKm, routeText } = req.body;

        if (!entryDate || !/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
            return res.status(400).json({ message: "Valid date is required" });
        }

        const parsedDistance = Number(distanceKm);
        if (!Number.isFinite(parsedDistance) || parsedDistance <= 0) {
            return res.status(400).json({ message: "Distance must be greater than 0" });
        }

        if (!routeText || !String(routeText).trim()) {
            return res.status(400).json({ message: "Route is required" });
        }

        const log = await DeliveryDistanceLog.create({
            deliveryBoy: req.user.id,
            entryDate,
            distanceKm: parsedDistance,
            routeText: String(routeText).trim(),
        });

        const populatedLog = await DeliveryDistanceLog.findById(log._id).populate(
            "deliveryBoy",
            "name email"
        );

        res.status(201).json({ message: "Distance log saved", log: populatedLog });
    } catch (error) {
        console.error("Create Delivery Log Error:", error);
        res.status(500).json({ message: "Server error while saving distance log" });
    }
};

exports.listDeliveryLogs = async (req, res) => {
    try {
        const query = {};

        if (req.user.role === "delivery") {
            query.deliveryBoy = req.user.id;
        }

        if (req.query.entryDate) {
            query.entryDate = req.query.entryDate;
        }

        const logs = await DeliveryDistanceLog.find(query)
            .populate("deliveryBoy", "name email")
            .sort({ entryDate: -1, createdAt: -1 });

        res.json(logs);
    } catch (error) {
        console.error("List Delivery Logs Error:", error);
        res.status(500).json({ message: "Server error while loading distance logs" });
    }
};