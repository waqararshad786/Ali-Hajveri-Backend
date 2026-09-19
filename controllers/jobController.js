import Job from "../models/Job.js";

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, message: "Job deleted" });
  } catch (error) {
    next(error);
  }
};

export const seedJobs = async (req, res, next) => {
  try {
    const count = await Job.countDocuments();
    if (count > 0) {
      return res.json({
        success: true,
        message: `Already have ${count} jobs. Skipping seed.`,
      });
    }

    const defaults = [
      {
        title: "Senior Electrician",
        company: "Al Faris Contracting LLC",
        location: "Dubai, UAE",
        country: "UAE",
        type: "Full Time",
        category: "Technical",
        salary: "AED 2,500 – 3,500",
        experience: "3–5 years",
        education: "Diploma / ITI",
        posted: "Just now",
        urgent: true,
        featured: true,
        tags: ["Electrical", "Wiring", "Maintenance"],
        description: "Looking for experienced electricians for a large construction project in Dubai.",
        requirements: [
          "3–5 years experience",
          "Valid ITI / Diploma in Electrical",
          "Willingness to relocate to UAE",
        ],
      },
      {
        title: "Structural Welder (6G)",
        company: "Saudi Aramco Contractor",
        location: "Dammam, Saudi Arabia",
        country: "Saudi Arabia",
        type: "Full Time",
        category: "Technical",
        salary: "SAR 2,200 – 3,000",
        experience: "5+ years",
        education: "Matric / ITI",
        posted: "Just now",
        urgent: true,
        tags: ["Welding", "6G", "Fabrication"],
        description: "Hiring 6G certified welders for oil & gas projects.",
        requirements: [
          "6G welding certification",
          "5+ years experience",
          "Must pass trade test",
        ],
      },
      {
        title: "Heavy Vehicle Driver",
        company: "Qatar Logistics Co.",
        location: "Doha, Qatar",
        country: "Qatar",
        type: "Full Time",
        category: "General",
        salary: "QAR 2,000 – 2,800",
        experience: "3–5 years",
        education: "Matric",
        posted: "Just now",
        urgent: false,
        tags: ["LTV", "HTV", "Gulf License"],
        description: "Looking for heavy vehicle drivers with Gulf licenses.",
        requirements: [
          "Valid HTV / LTV Gulf license",
          "3–5 years experience",
        ],
      },
    ];

    await Job.insertMany(defaults);
    res.json({
      success: true,
      message: `Seeded ${defaults.length} jobs`,
      count: defaults.length,
    });
  } catch (error) {
    next(error);
  }
};