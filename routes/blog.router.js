const express = require("express");
const { Createblog, getallblogs, deleteblog, updateblog } = require("../Controllers/blog.controllers");
const auth = require("../middelwere/auth");

const app = express();

const blogRouter = express.Router();

blogRouter.post("/Createblog",auth,Createblog)
blogRouter.get("/getallblogs",auth,getallblogs)
blogRouter.delete("/deleteblog/:id",auth,deleteblog)
blogRouter.patch("/updateblog/:id",auth,updateblog)
module.exports = blogRouter;
