const Message = require("../models/message");
const { body, validationResult } = require("express-validator");

exports.create_get = (req, res, next) => {
    if (!res.locals.currentUser) {
        // Users not logged in cannot access "create a message page"
        return res.redirect("/log-in");
      }
      res.render("message_form", {user: res.locals.currentUser });
  };

exports.create_post = [
    body("messageTitle").trim().isLength({ min: 1 }).withMessage("Title must not be empty"),
    body("messageInfo").trim().isLength({ min: 1 }).withMessage("Text must not be empty"),
  
    async (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        res.render("message_form", { errors: errors.array() });
      }
      
  
      const message = new Message({
        user: req.user._id,
        title: req.body.messageTitle,
        text: req.body.messageInfo,
        time: Date.now()
      })
      
      await message.save((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    }
  ];
exports.delete_post = (req, res, next) => {
  Message.findByIdAndRemove(req.body.messageId, (err) => {
    if (err) {
      return next(err);
    }
    // Success - go to index
    res.redirect("/");
  });
}


