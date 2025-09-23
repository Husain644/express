// models/Task.js
import mongoose from "mongoose";


const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true, // must have a name
      trim: true,
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    },
    dueDate: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } // auto add createdAt & updatedAt
);

export default mongoose.model("Task", taskSchema);

const LibrarySchema=new mongoose.Schema(
    {
      frameWork:{
      type: String,
      required: true, // must have a name
      unique:true
      },
    PackagesList:{
     type:[],
     default:[]
    }
    }
)

export const Packages=  mongoose.model("Packages", LibrarySchema);
