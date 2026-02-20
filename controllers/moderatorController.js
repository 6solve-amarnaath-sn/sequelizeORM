const {Snippet,User}=require("../models");

const getAllPublicSnippets= async(req,res)=>{
  let visibilityCriteria = ["public"];

        if (req.user && req.user.role === "admin") {
            visibilityCriteria = ["public", "private"];
        }
    const snippets=await Snippet.findAll({
        where:{visibility:visibilityCriteria},
        include:{
            model:User,
            as:"author",
            attributes:["id","name"],
        },
        order:[["createdAt", "DESC"]],
    });
    res.json(snippets);
}


const deleteSnippet = async (req, res) => {
  const { id } = req.params;

  const snippet = await Snippet.findByPk(id);
  if (!snippet) {
    return res.status(404).json({ msg: "Snippet not found" });
  }

  await snippet.destroy();

  res.json({ msg: "Snippet deleted successfully" });
};


const hideSnippet = async (req, res) => {
  const { id } = req.params;

  const snippet = await Snippet.findByPk(id);
  if (!snippet) {
    return res.status(404).json({ msg: "Snippet not found" });
  }

  snippet.visibility = "private";
  await snippet.save();

  res.json({ msg: "Snippet hidden (set to private)" });
};

module.exports = {
  getAllPublicSnippets,
  deleteSnippet,
  hideSnippet,
};