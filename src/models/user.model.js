import mongoose from "mongoose";

/* =========================
   COMMON SUB SCHEMAS
========================= */

const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    graduation_year: { type: Number, required: true }
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
    project_link: { type: String, required: true, trim: true },
    image_url: { type: String, required: true, trim: true }
  },
  { _id: true }
);

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
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
    certificate_pdf_url: { type: String, required: true, trim: true }
  },
  { _id: true }
);

/* =========================
   SOCIAL LINKS
========================= */
const SocialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, required: true, trim: true },
    linkedin: { type: String, required: true, trim: true },
    twitter: { type: String, required: true, trim: true },
    facebook: { type: String, required: true, trim: true }
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
    username: { type: String, required: true, unique: true, trim: true },
    phone_number: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    /* ---------- PORTFOLIO META ---------- */
    portfolio_type: {
      type: String,
      enum: ["fresher", "experienced"],
      default: null
    },

    profile_image_url: {
      type: String,
      required: function () {
        return !!this.portfolio_type;
      },
      trim: true
    },

    social_links: {
      type: SocialLinksSchema,
      required: function () {
        return !!this.portfolio_type;
      }
    },

    certifications: {
      type: [CertificationSchema],
      default: [],
      required: function () {
        return !!this.portfolio_type;
      },
      validate: {
        validator: function (v) {
          return !this.portfolio_type || (Array.isArray(v) && v.length > 0);
        },
        message: "At least one certification is required"
      }
    },

    /* ---------- PORTFOLIOS ---------- */
    fresher: {
      type: FresherSchema,
      required: function () {
        return this.portfolio_type === "fresher";
      }
    },

    experienced: {
      type: ExperiencedSchema,
      required: function () {
        return this.portfolio_type === "experienced";
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
