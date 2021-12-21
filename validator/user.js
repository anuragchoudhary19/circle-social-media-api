exports.validateSignup = (req, res, next) => {
  // check for Name
  req.check('username', 'Username is required').notEmpty();
  // check for Email
  req
    .check('email', 'Email is required')
    .notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage('Email must conatin @');

  req
    .check('password', 'Password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');

  // check for error
  const errors = req.validationErrors();
  // if errors show the first one as they happen
  if (errors) {
    // console.log(res.status(403).json(errors[0]));
    return res.status(403).send(errors[0]);
  }
  // proceed to next middleware
  next();
};
