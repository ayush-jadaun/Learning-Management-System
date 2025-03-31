import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, "Length of title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: [500, "Length of description cannot exceed 500 characters"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    duration: {
      type: Number,
      default: 0,
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required for video management"],
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: [true, "Lecture order is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to round the duration
lectureSchema.pre("save", function (next) {
  if (this.duration) {
    this.duration = Number(this.duration.toFixed(2));
  }
  next();
});

export const Lecture = mongoose.model("Lecture", lectureSchema);
