const CheckAuthor = (req, res, next) => {
    console.log(req.user);
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(400).json({ message: "You are not an admin" });
    }
};
module.exports = CheckAuthor;