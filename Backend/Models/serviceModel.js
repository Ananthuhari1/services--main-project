const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "listing",
        "plumbing",
        "cleaning",
        "electrical",
        "carpenter",
        "appliance",
        "saloon",
        "beauty",
        "others"
      ],
      default: "others",
    },
    subcategory: {
      type: String,
      enum: [
        'home_cleaning',
        'deep_cleaning',
        'office_cleaning',
        'carpet_cleaning',
        'window_cleaning',
        'post_construction',
        'move_in_out',
        'other'
      ],
      required: function() {
        return this.category === 'cleaning';
      }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "ownerModel",
    },
    ownerModel: {
      type: String,
      enum: ["Provider", "Admin", "User"],
      default: "Provider",
    },
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);

module.exports = Service;