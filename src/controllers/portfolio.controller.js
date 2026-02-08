import User from "../models/user.model.js";

/* =========================
   HELPER VALIDATION FUNCTIONS
========================= */
const validateArray = (arr, name) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return `${name} must have at least one item`;
  }
  return null;
};

const validateSocialLinks = (social_links) => {
  const required = ["github", "linkedin", "twitter", "facebook"];
  for (const field of required) {
    if (!social_links?.[field]) return `Social link ${field} is required`;
  }
  return null;
};

const validateCertifications = (certifications) => {
  if (!Array.isArray(certifications) || certifications.length === 0) {
    return "At least one certification is required";
  }
  for (const cert of certifications) {
    if (!cert.title || !cert.issuer || !cert.issue_date || !cert.certificate_pdf_url) {
      return "All certification fields are required";
    }
  }
  return null;
};

const validateFresher = (fresher) => {
  if (!fresher) return "Fresher portfolio data is required";

  let err =
    validateArray(fresher.education, "Education") ||
    validateArray(fresher.skills, "Skills") ||
    validateArray(fresher.projects, "Projects");

  if (err) return err;

  for (const proj of fresher.projects) {
    if (!proj.title || !proj.description || !proj.technologies?.length || !proj.project_link || !proj.image_url) {
      return "All project fields are required for Fresher portfolio";
    }
  }

  return null;
};

const validateExperienced = (experienced) => {
  if (!experienced) return "Experienced portfolio data is required";

  let err =
    validateArray(experienced.education, "Education") ||
    validateArray(experienced.skills, "Skills") ||
    validateArray(experienced.projects, "Projects") ||
    validateArray(experienced.experience, "Experience");

  if (err) return err;

  for (const proj of experienced.projects) {
    if (!proj.title || !proj.description || !proj.technologies?.length || !proj.project_link || !proj.image_url) {
      return "All project fields are required for Experienced portfolio";
    }
  }

  for (const exp of experienced.experience) {
    if (!exp.role || !exp.company || !exp.start_date || !exp.end_date || !exp.description) {
      return "All experience fields are required for Experienced portfolio";
    }
  }

  return null;
};

/* =========================
   CREATE OR UPDATE PORTFOLIO
========================= */
export const createOrUpdatePortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { portfolio_type, profile_image_url, social_links, certifications, fresher, experienced } = req.body;

    // ---------- BASIC VALIDATIONS ----------
    if (!portfolio_type || !["fresher", "experienced"].includes(portfolio_type)) {
      return res.status(400).json({ success: false, message: "Valid portfolio type is required" });
    }

    if (!profile_image_url) return res.status(400).json({ success: false, message: "Profile image is required" });

    const socialErr = validateSocialLinks(social_links);
    if (socialErr) return res.status(400).json({ success: false, message: socialErr });

    const certErr = validateCertifications(certifications);
    if (certErr) return res.status(400).json({ success: false, message: certErr });

    // ---------- FETCH USER ----------
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ---------- PORTFOLIO SPECIFIC VALIDATION ----------
    if (portfolio_type === "fresher") {
      if (experienced) return res.status(400).json({ success: false, message: "Experienced data not allowed for fresher portfolio" });
      const fresherErr = validateFresher(fresher);
      if (fresherErr) return res.status(400).json({ success: false, message: fresherErr });
    }

    if (portfolio_type === "experienced") {
      if (fresher) return res.status(400).json({ success: false, message: "Fresher data not allowed for experienced portfolio" });
      const experiencedErr = validateExperienced(experienced);
      if (experiencedErr) return res.status(400).json({ success: false, message: experiencedErr });
    }

    // ---------- SAVE DATA ----------
    user.set({
      portfolio_type,
      profile_image_url,
      social_links,
      certifications,
      fresher: portfolio_type === "fresher" ? fresher : null,
      experienced: portfolio_type === "experienced" ? experienced : null
    });

    await user.save();

    res.status(200).json({ success: true, message: "Portfolio saved successfully" });
  } catch (error) {
    console.error("Portfolio Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   GET MY PORTFOLIO
========================= */
export const getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        portfolio_type: user.portfolio_type,
        profile_image_url: user.profile_image_url,
        social_links: user.social_links,
        certifications: user.certifications,
        fresher: user.fresher || null,
        experienced: user.experienced || null
      }
    });
  } catch (error) {
    console.error("Get Portfolio Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
