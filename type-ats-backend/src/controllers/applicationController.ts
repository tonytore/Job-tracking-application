// src/controllers/applicationController.ts
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import applicationService from "../service/applicantService";
import fs from "fs"; // Import fs for file cleanup

// Extend the Request type to include 'files' from Multer
interface MulterRequest extends Request {
  files?:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[];
}

const applicationController = {
  submitApplication: catchAsync(async (req: MulterRequest, res: Response) => {
    const cvFile =
      req.files &&
      (req.files as { cvFile?: Express.Multer.File[] }).cvFile?.[0];
    const profilePictureFile =
      req.files &&
      (req.files as { profilePictureFile?: Express.Multer.File[] })
        .profilePictureFile?.[0];

    const {
      jobPostingId,
      firstName,
      lastName,
      email,
      yearsOfExperience,
      highestEducation,
      coverLetter,
    } = req.body; // <--- These fields will now be populated by Multer

    if (
      !jobPostingId ||
      !firstName ||
      !lastName ||
      !email ||
      !yearsOfExperience ||
      !highestEducation ||
      !cvFile // CV is required
    ) {
      if (cvFile && cvFile.path && fs.existsSync(cvFile.path)) {
        fs.unlinkSync(cvFile.path);
      }
      if (
        profilePictureFile &&
        profilePictureFile.path &&
        fs.existsSync(profilePictureFile.path)
      ) {
        fs.unlinkSync(profilePictureFile.path);
      }
      return res
        .status(400)
        .json({ message: "Missing required application fields or CV." });
    }

    try {
      const application = await applicationService.submitApplication({
        jobPostingId,
        firstName,
        lastName,
        email,
        yearsOfExperience: parseInt(yearsOfExperience as string, 10),
        highestEducation,
        coverLetter: (coverLetter as string) || null,
        cvFileName: cvFile.filename,
        profilePictureFileName: profilePictureFile
          ? profilePictureFile.filename
          : null,
      });
      res
        .status(201)
        .json({ message: "Application submitted successfully", application });
    } catch (error: any) {
      if (cvFile && cvFile.path && fs.existsSync(cvFile.path)) {
        fs.unlinkSync(cvFile.path);
      }
      if (
        profilePictureFile &&
        profilePictureFile.path &&
        fs.existsSync(profilePictureFile.path)
      ) {
        fs.unlinkSync(profilePictureFile.path);
      }
      console.error("Error submitting application:", error);
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }),

  // ... (rest of your applicationController methods)
  getAllApplications: catchAsync(async (req: Request, res: Response) => {
    const applications = await applicationService.getAllApplications();
    res.status(200).json(applications);
  }),

  getApplicationsForJob: catchAsync(async (req: Request, res: Response) => {
    const { jobPostingId } = req.params;

    if (!jobPostingId) {
      return res.status(400).json({ message: "Job Posting ID is required." });
    }

    const applications = await applicationService.getApplicationsByJobPostingId(
      jobPostingId
    );

    if (applications.length === 0) {
      return res.status(404).json({
        message:
          "No applications found for this job posting or job posting does not exist.",
      });
    }

    res.status(200).json(applications);
  }),
};

export default applicationController;
