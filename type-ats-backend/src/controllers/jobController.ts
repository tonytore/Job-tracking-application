// src/controllers/jobController.ts
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import jobService from "../service/jobService";
import { JobPosting } from "@prisma/client";

/**
 * Controller for handling job posting requests.
 */
const jobController = {
  /**
   * Handles the creation of a new job posting.
   * @param req The Express request object.
   * @param res The Express response object.
   */
  createJobPosting: catchAsync(async (req: Request, res: Response) => {
    const { title, description, requiredSkills, department, closingDate } =
      req.body;

    if (
      !title ||
      !description ||
      !requiredSkills ||
      !department ||
      !closingDate
    ) {
      return res.status(400).json({
        message:
          "All job posting fields (title, description, requiredSkills, department, closingDate) are required.",
      });
    }

    if (
      !Array.isArray(requiredSkills) ||
      !requiredSkills.every((skill) => typeof skill === "string")
    ) {
      return res
        .status(400)
        .json({ message: "Required skills must be an array of strings." });
    }

    const parsedClosingDate = new Date(closingDate);
    if (isNaN(parsedClosingDate.getTime())) {
      return res.status(400).json({
        message:
          "Invalid closing date format. Please use a valid date string (e.g.,YYYY-MM-DD).",
      });
    }
    if (parsedClosingDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Closing date must be in the future." });
    }

    const job = await jobService.createJobPosting({
      title,
      description,
      requiredSkills,
      department,
      closingDate: parsedClosingDate,
    });
    res.status(201).json({ message: "Job created", job });
  }),

  /**
   * Handles fetching all job postings.
   * @param req The Express request object.
   * @param res The Express response object.
   */
  getAllJobPostings: catchAsync(async (req: Request, res: Response) => {
    const { title, department, skills } = req.query; // Extract query parameters

    // Construct a filter object based on provided query parameters
    const filters: {
      title?: string;
      department?: string;
      skills?: string[];
    } = {};

    if (typeof title === "string" && title.trim() !== "") {
      filters.title = title.trim();
    }
    if (typeof department === "string" && department.trim() !== "") {
      filters.department = department.trim();
    }
    // 'skills' can be a comma-separated string, convert to array
    if (typeof skills === "string" && skills.trim() !== "") {
      filters.skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
    }

    const jobs = await jobService.getAllJobPostings(filters); // Pass filters to the service
    res.status(200).json(jobs);
  }),

  /**
   * Handles fetching a single job posting by its ID.
   * @param req The Express request object.
   * @param res The Express response object.
   */
  getJobPostingById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const job = await jobService.getJobPostingById(id);

    if (!job) {
      return res.status(404).json({ message: "Job posting not found." });
    }

    res.status(200).json(job);
  }),

  /**
   * Handles updating an existing job posting by its ID.
   * Uses PATCH for partial updates, but PUT can also be used if you expect full replacement.
   * For simplicity, let's use PUT and assume all fields might be provided, but handle partial updates.
   * @param req The Express request object.
   * @param res The Express response object.
   */
  updateJobPosting: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, requiredSkills, department, closingDate } =
      req.body;

    // Construct update data, allowing partial updates
    const updateData: {
      title?: string;
      description?: string;
      requiredSkills?: string[];
      department?: string;
      closingDate?: Date;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (department !== undefined) updateData.department = department;

    if (requiredSkills !== undefined) {
      if (
        !Array.isArray(requiredSkills) ||
        !requiredSkills.every((skill) => typeof skill === "string")
      ) {
        return res.status(400).json({
          message: "Required skills must be an array of strings if provided.",
        });
      }
      updateData.requiredSkills = requiredSkills;
    }

    if (closingDate !== undefined) {
      const parsedClosingDate = new Date(closingDate);
      if (isNaN(parsedClosingDate.getTime())) {
        return res.status(400).json({
          message:
            "Invalid closing date format for update. Please use a valid date string (e.g.,YYYY-MM-DD).",
        });
      }
      // Optional: You might still want to ensure it's a future date on update, unless allowing past dates for "closed" status
      if (parsedClosingDate < new Date()) {
        return res.status(400).json({
          message: "Closing date must be in the future (for active postings).",
        });
      }
      updateData.closingDate = parsedClosingDate;
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }

    const updatedJob = await jobService.updateJobPosting(id, updateData);

    if (!updatedJob) {
      return res.status(404).json({ message: "Job posting not found." });
    }

    res
      .status(200)
      .json({ message: "Job posting updated successfully", job: updatedJob });
  }),

  /**
   * Handles deleting a job posting by its ID.
   * @param req The Express request object.
   * @param res The Express response object.
   */
  deleteJobPosting: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deletedJob = await jobService.deleteJobPosting(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job posting not found." });
    }

    res
      .status(200)
      .json({ message: "Job posting deleted successfully", job: deletedJob });
  }),

  /**
   * Handles fetching job posting analytics.
   * @param req The Express request object.
   * @param res The Express response object.
   */
  getJobAnalytics: catchAsync(async (req: Request, res: Response) => {
    const analytics = await jobService.getJobPostingAnalytics();
    res.status(200).json(analytics);
  }),
};

export default jobController;
