import Archive from "../models/archive.model.js";

/* SEARCH ARCHIVE */

export const searchArchive = async (req,res) => {

try {

const { q, category, year } = req.query;

let filter = {};

if(category) filter.category = category;
if(year) filter.year = Number(year);

let results;

if(q){

results = await Archive.find(
{
$and:[
filter,
{
$text: { $search: q }
}
]
},
{
score:{ $meta:"textScore"}
}
).sort({ score:{ $meta:"textScore"} });

}
else{

results = await Archive.find(filter)
.sort({ year:-1 });

}

res.json(results);

}
catch(error){

res.status(500).json({
message:"Archive search failed"
});

}

};