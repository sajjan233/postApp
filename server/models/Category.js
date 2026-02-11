// models/category.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      set: function (v) {
        const str = v || this.name || "";
        return str.toLowerCase().trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-");
      },
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);


// --------------------------------------
// 🔥 AUTO UNIQUE SLUG LOGIC
// --------------------------------------
categorySchema.pre("save", async function (next) {
  if (!this.isModified("slug")) return next();

  const baseSlug = this.slug;
  let slug = baseSlug;
  let counter = 1;

  // Check slug existence
  while (
    await mongoose.models.Category.findOne({
      slug,
      _id: { $ne: this._id }, // avoid matching itself on update
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

module.exports = mongoose.model("Category", categorySchema);
