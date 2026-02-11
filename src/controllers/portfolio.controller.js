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
    
    // ─── Add username and phone_number to destructuring ───
    const { 
      portfolio_type, 
      profile_image_url, 
      social_links, 
      certifications, 
      fresher, 
      experienced,
      username,           // ← NEW
      phone_number        // ← NEW
    } = req.body;

    // ---------- BASIC VALIDATIONS ----------
    if (!portfolio_type || !["fresher", "experienced"].includes(portfolio_type)) {
      return res.status(400).json({ success: false, message: "Valid portfolio type is required" });
    }

    if (!profile_image_url) {
      return res.status(400).json({ success: false, message: "Profile image is required" });
    }

    // ─── Optional: validate username & phone if provided ───
    if (username !== undefined) {
      if (typeof username !== 'string' || username.trim().length < 3) {
        return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
      }
      // Check uniqueness (important!)
      const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Username is already taken" });
      }
    }

    if (phone_number !== undefined) {
      if (typeof phone_number !== 'string' || !/^\+?[1-9]\d{9,14}$/.test(phone_number.trim())) {
        return res.status(400).json({ success: false, message: "Invalid phone number format" });
      }
      // Check uniqueness for phone too
      const existingPhone = await User.findOne({ phone_number: phone_number.trim(), _id: { $ne: userId } });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: "Phone number is already in use" });
      }
    }

    // ... your existing validations for social_links, certifications, fresher/experienced ...

    // ---------- FETCH USER ----------
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ---------- PORTFOLIO SPECIFIC VALIDATION ----------
    // (your existing code remains unchanged)

    // ---------- SAVE DATA ----------
    user.set({
      portfolio_type,
      profile_image_url,
      social_links,
      certifications,
      fresher: portfolio_type === "fresher" ? fresher : null,
      experienced: portfolio_type === "experienced" ? experienced : null,
      
      // ─── NEW ─── Only update if provided in request
      ...(username !== undefined && { username: username.trim() }),
      ...(phone_number !== undefined && { phone_number: phone_number.trim() }),
    });

    await user.save();

    // Optional but very useful: return the updated user (without password)
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({ 
      success: true, 
      message: "Portfolio and profile updated successfully",
      user: updatedUser   // ← frontend can use this to update localStorage
    });

  } catch (error) {
    console.error("Portfolio Error:", error.message);
    
    if (error.code === 11000) { // duplicate key error (username or phone)
      return res.status(400).json({ 
        success: false, 
        message: "Username or phone number is already taken" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   GET MY PORTFOLIO
========================= */
export const getMyPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Include username and phone_number in the response
    const user = await User.findById(userId).select(
      "-password -__v"   // keep password hidden
    );

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        phone_number: user.phone_number,
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
