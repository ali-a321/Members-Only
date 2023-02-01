const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.member_get = (req, res, next) => {
    if (!res.locals.currentUser) {
        // User cannot access the members form unless logged in
        return res.redirect("/log-in");
      }
      return res.render("member_form", {user: res.locals.currentUser  });
    };

exports.member_post = [
        body("secretPhrase").trim().isLength({ min: 1 }).escape().withMessage("Secret Phrase must be specified."),
        
        async (req, res, next) => {
          const errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            // If there is an error submitting the member validation form, re-render the form with an error
            return res.render("member_form", {user: res.locals.currentUser, errors: errors.array() });
          } else if (req.body.secretPhrase != process.env.MEMBER_PASSCODE) {
            return res.render("member_form", { user: res.locals.currentUser, passcodeError: "Wrong Secret Phrase" });
          }
      
          const user = new User(res.locals.currentUser);
          user.member = true;
      
          await User.findByIdAndUpdate(
            res.locals.currentUser._id, 
            user, {}, (err) => {
            if (err) return next(err);
            return res.redirect("/member");
          }).clone().catch(function(err){console.log(err)});
        },
      ];

exports.admin_get = (req, res, next) => {
  if (!res.locals.currentUser) {
      // User cannot access the admin form unless logged in
      return res.redirect("/log-in");
    }
    return res.render("admin_form", {user: res.locals.currentUser  });
  };

  exports.admin_post = [
    body("secretCode").trim().isLength({ min: 1 }).escape().withMessage("Secret Phrase must be specified."),
    
    async (req, res, next) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        // If there is an error submitting the admin validation form, re-render the form with an error
        return res.render("admin_form", {user: res.locals.currentUser, errors: errors.array() });
      } else if (req.body.secretCode != process.env.ADMIN_PASSCODE) {
        return res.render("admin_form", { user: res.locals.currentUser, passcodeError: "Wrong Secret Phrase" });
      }
  
      const user = new User(res.locals.currentUser);
      user.member = true;
      user.admin = true;
      
  
      await User.findByIdAndUpdate(
        res.locals.currentUser._id, 
        user, {}, (err) => {
        if (err) return next(err);
        return res.redirect("/admin");
      }).clone().catch(function(err){console.log(err)});
    },
  ];
