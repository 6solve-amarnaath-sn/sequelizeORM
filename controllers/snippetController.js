const { Snippet, User } = require('../models');
const { Op } = require('sequelize');


exports.createSnippet = async (req, res) => {
  const { title, description, code, language, visibility, tags } = req.body;

  const user=await User.findByPk(req.user.id);
  if(!user){
    return res.status(401).json({msg:"user not find"});
  }

  const snippet = await Snippet.create({
    title,
    description,
    code,
    language,
    visibility,
    tags,
    userId: req.user.id,
  });

  res.status(201).json(snippet);
};


exports.getPublicSnippets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || "";
  const tag = req.query.tag || "";

  const offset = (page - 1) * limit;

  const where = {
    visibility: "public",
  };

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { tags: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (tag) {
    where.tags = { [Op.iLike]: `%${tag}%` };
  }
  where.moderatorHidden=false

  const { count, rows } = await Snippet.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name"],
      },
    ],
  });

  res.json({
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    snippets: rows,
  });
};

exports.getSnippetById = async (req, res) => {
  const snippet = await Snippet.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as:"author",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!snippet)
    return res.status(404).json({ msg: "Snippet not found" });

 
  if (
    snippet.visibility === "private" &&
    snippet.author.id !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ msg: "Forbidden" });
  }

  if(snippet.moderatorHidden && snippet.author.id !== req.user.id &&
    (req.user.role !== "admin" || req.user.role !== "moderator" )){
      return res.status(403).json({ msg: "Forbidden" });
    }

  res.json(snippet);
};



exports.getMySnippets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  console.log(req.user.id)
  const { count, rows } = await Snippet.findAndCountAll({
    where: { userId: req.user.id },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as:"author",
        attributes: ["id", "name"],
      },
    ],
  });

  res.json({
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    snippets: rows,
  });
};


exports.updateSnippet = async (req, res) => {
  const snippet = await Snippet.findByPk(req.params.id);

  if (!snippet)
    return res.status(404).json({ msg: "Not found" });

  if (snippet.userId !== req.user.id && req.user.role!=="admin")
    return res.status(403).json({ msg: "Forbidden" });

  const { title, description, code, language, visibility, tags } = req.body;

  await snippet.update({
    title,
    description,
    code,
    language,
    visibility,
    tags,
  });

  res.json(snippet);
};



exports.deleteSnippet = async (req, res) => {
  const snippet = await Snippet.findByPk(req.params.id);

  if (!snippet)
    return res.status(404).json({ msg: 'Not found' });

  if (
    snippet.userId !== req.user.id &&
    !['admin', 'moderator'].includes(req.user.role)
  ) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  await snippet.destroy();

  res.json({ msg: 'Deleted successfully' });
};


