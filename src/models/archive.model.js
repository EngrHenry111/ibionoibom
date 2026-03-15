import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema(
{
title: {
type: String,
required: true
},

description: String,

category: {
type: String,
enum: [
"leader",
"document",
"news",
"policy",
"report"
]
},

year: Number,

tags: [String],

fileUrl: String,

referenceId: mongoose.Schema.Types.ObjectId
},
{ timestamps: true }
);

/* SEARCH INDEX */
archiveSchema.index({
title: "text",
description: "text",
tags: "text"
});

export default mongoose.model("Archive", archiveSchema); 