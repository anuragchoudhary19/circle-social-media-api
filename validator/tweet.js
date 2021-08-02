exports.validateCreateStatus = (req, res, next) => {
  // create error
  req.check('tweet', 'Write a post').notEmpty();
  req.check('tweet', 'Post must be between 1 and 200 characters').isLength({ min: 1, max: 1000 });
  // check for error
  const errors = req.validationErrors();
  // if errors show the first one as they happen
  if (errors) {
    console.log(errors);
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware
  next();
};
