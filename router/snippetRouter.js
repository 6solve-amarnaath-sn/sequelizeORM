const { Router } = require("express");
const { getPublicSnippets, getMySnippets, createSnippet, updateSnippet, deleteSnippet, getSnippetById, suggestion } = require("../controllers/snippetController");
const verify = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createSnippetSchema } = require("../validations/snippetValidator");
const authorize = require("../middleware/authorize");

const snippetRouter = Router();

snippetRouter.get("/", getPublicSnippets);


snippetRouter.get("/my", verify, getMySnippets);
snippetRouter.get("/suggestions",suggestion);

snippetRouter.use(verify);
snippetRouter.get("/:id",authorize(["user","moderator","admin"]), getSnippetById);


snippetRouter.post('/', validate(createSnippetSchema), createSnippet);

snippetRouter.put('/:id', validate(createSnippetSchema), updateSnippet);

snippetRouter.delete('/:id', deleteSnippet);



module.exports = snippetRouter;