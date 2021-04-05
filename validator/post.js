exports.validateCreatePost = (req, res, next) => {
    // create error
    req.check('post', 'Write a post').notEmpty();
    req.check('post', 'Post must be between 1 and 200 characters').isLength({ min: 1, max: 200 });
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
