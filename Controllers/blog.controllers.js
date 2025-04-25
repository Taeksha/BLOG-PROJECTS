const blogModel = require("../Models/blog.model");

const Createblog = async (req, res) => {
  const { title, content, tags, publishedDate } = req.body; 
  const author = req.user._id; 

  if (!title || !content || !tags || !publishedDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await blogModel.create({ title, author, content, tags, publishedDate });
    return res.status(201).json({ message: "Blog created successfully", blog: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const getallblogs = async (req, res) => {
  const userid=req.user._id;
  console.log(userid);
  try {
    const result=await blogModel.find({author:userid});
    
    return res.status(200).json({message:"All blogs",blogs:result});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }

}
const deleteblog=async (req,res)=>{
  const blogid=req.params.id;
  try {
    const result=await blogModel.findByIdAndDelete(blogid);
    return res.status(200).json({message:"Blog deleted successfully",blog:result});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}
const updateblog=async (req,res)=>{
  const blogid=req.params.id;
  const {title,content,tags,publishedDate}=req.body;
  try {
    const result=await blogModel.findByIdAndUpdate(blogid,{title,content,tags,publishedDate},{new:true});
    return res.status(200).json({message:"Blog updated successfully",blog:result});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}
module.exports={Createblog,getallblogs,deleteblog,updateblog}