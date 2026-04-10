const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { ensureDeliveryUser } = require("./utils/ensureDeliveryUser");
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
const app = express();

// app.use(cors({
//     origin: ["http://localhost:3000", "https://arogyamrahita.vercel.app"],
//     credentials: true,
// }));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
mongoose
    .connect(mongoUri)
    .then(async () => {
        console.log("MongoDB Connected");
        try {
            await ensureDeliveryUser();
            console.log("Default delivery account is ready");
        } catch (error) {
            console.error("Delivery account bootstrap failed:", error.message || error);
        }
    })
    .catch((err) => console.error("MongoDB Error:", err));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.route"));
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/discount-hero", require("./routes/discountHero.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/orders", require("./routes/order.route"));
app.use("/api/delivery-logs", require("./routes/deliveryLog.route"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));