import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    slug: { type: String },
    status : {type : Boolean}
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", RoleSchema);
export default Role;
