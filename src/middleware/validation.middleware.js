/*
  Generic request body validation middleware
*/

/*
  Validate required fields exist in req.body
*/
export const validateRequiredFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields
      });
    }

    next();
  };
};

/*
  Validate portfolio payload based on portfolio type
*/
export const validatePortfolioPayload = (req, res, next) => {
  const { portfolio_type, fresher, experienced } = req.body;

  if (!portfolio_type) {
    return res.status(400).json({
      success: false,
      message: "portfolio_type is required"
    });
  }

  if (!["fresher", "experienced"].includes(portfolio_type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid portfolio_type"
    });
  }

  if (portfolio_type === "fresher") {
    if (!fresher) {
      return res.status(400).json({
        success: false,
        message: "Fresher portfolio data is required"
      });
    }

    if (experienced) {
      return res.status(400).json({
        success: false,
        message: "Experienced data is not allowed for fresher portfolio"
      });
    }
  }

  if (portfolio_type === "experienced") {
    if (!experienced) {
      return res.status(400).json({
        success: false,
        message: "Experienced portfolio data is required"
      });
    }
  }

  next();
};
