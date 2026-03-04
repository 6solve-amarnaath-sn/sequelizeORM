module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors: error.details.map(err => err.message)
      });
    }

    req.body = value;
    next();
  };
};
