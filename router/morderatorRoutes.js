const { Router } = require("express");
const verify = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getAllPublicSnippets,
  deleteSnippet,
  hideSnippet,
} = require("../controllers/moderatorController");

const moderatorRouter = Router();


moderatorRouter.use(verify, authorize(["moderator", "admin"]));

moderatorRouter.get("/snippets", getAllPublicSnippets);

moderatorRouter.delete("/snippets/:id", deleteSnippet);

moderatorRouter.put("/snippets/:id/hide", hideSnippet);

module.exports = moderatorRouter;
