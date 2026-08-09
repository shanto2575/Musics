import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, trim: true, default: "" },
    genre: { type: String, trim: true, default: "" },
    audioUrl: { type: String, required: true },
    coverUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    audioPublicId: { type: String, default: "" },
    coverPublicId: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
