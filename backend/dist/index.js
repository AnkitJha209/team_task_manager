import express, {} from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/health-check", (req, res) => {
    res.status(200).json({ status: "ok" });
});
// mount API routes under /api/v1
app.use("/api/v1", apiRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map