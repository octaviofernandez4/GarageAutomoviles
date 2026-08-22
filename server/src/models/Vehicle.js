import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    km: { type: Number, required: true },
    engine: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
