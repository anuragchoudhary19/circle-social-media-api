exports.validateSignup = (req, res, next) => {
    // check for firstName
    req.check('name', 'Name is required').notEmpty();
    // check for Email
    req
        .check('email', 'Email is required')
        .notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage('Email must be in the form john@smith.domain');

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
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
};
