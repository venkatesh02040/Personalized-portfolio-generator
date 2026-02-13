import mongoose from "mongoose";

/* =========================
   COMMON SUB SCHEMAS
========================= */

const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    graduation_year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear() + 5
    }
  },
  { _id: true }
);

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 1, max: 10 }
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    technologies: {
      type: [String],
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "At least one technology is required"
      }
    },
    project_link: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Project link must be a valid URL"]
    },
    image_url: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Image must be a valid URL"]
    }
  },
  { _id: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    start_date: { type: Date, required: true },
    end_date: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.start_date;
        },
        message: "End date must be after start date"
      }
    },
    description: { type: String, required: true, trim: true }
  },
  { _id: true }
);

/* =========================
   CERTIFICATION
========================= */
const CertificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issue_date: { type: Date, required: true },
    certificate_pdf_url: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Certificate must be a valid URL"]
    }
  },
  { _id: true }
);

/* =========================
   SOCIAL LINKS
========================= */
const SocialLinksSchema = new mongoose.Schema(
  {
    github: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Invalid GitHub URL"]
    },
    linkedin: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Invalid LinkedIn URL"]
    },
    twitter: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Invalid Twitter URL"]
    },
    facebook: {
      type: String,
      required: true,
      trim: true,
      match: [/^https?:\/\/.+/, "Invalid Facebook URL"]
    }
  },
  { _id: false }
);

/* =========================
   FRESHER PORTFOLIO
========================= */
const FresherSchema = new mongoose.Schema(
  {
    education: {
      type: [EducationSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    },
    skills: {
      type: [SkillSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    },
    projects: {
      type: [ProjectSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    }
  },
  { _id: false }
);

/* =========================
   EXPERIENCED PORTFOLIO
========================= */
const ExperiencedSchema = new mongoose.Schema(
  {
    education: {
      type: [EducationSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    },
    skills: {
      type: [SkillSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    },
    projects: {
      type: [ProjectSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    },
    experience: {
      type: [ExperienceSchema],
      default: [],
      validate: v => Array.isArray(v) && v.length > 0
    }
  },
  { _id: false }
);

/* =========================
   USER SCHEMA
========================= */
const UserSchema = new mongoose.Schema(
  {
    /* ---------- AUTH ---------- */
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    gmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },

    password: {
      type: String,
      required: true
    },

    /* ---------- PORTFOLIO META ---------- */
    portfolio_type: {
      type: String,
      enum: ["fresher", "experienced"],
      default: null
    },

    profile_image_url: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Profile image must be a valid URL"]
    },

    social_links: {
      type: SocialLinksSchema
    },

    certifications: {
      type: [CertificationSchema],
      default: []
    },

    /* ---------- PORTFOLIOS ---------- */
    fresher: {
      type: FresherSchema
    },

    experienced: {
      type: ExperiencedSchema
    }
  },
  { timestamps: true }
);

/* =========================
   SAFETY VALIDATION
========================= */

UserSchema.pre("validate", function () {
  if (this.portfolio_type === "fresher" && this.experienced) {
    throw new Error("Experienced data not allowed for fresher");
  }

  if (this.portfolio_type === "experienced" && this.fresher) {
    throw new Error("Fresher data not allowed for experienced");
  }
});


export default mongoose.model("User", UserSchema);
