import { db } from "../db/db"; // Import the Prisma client instance
import { Application, Applicant, JobPosting } from "@prisma/client"; // Import necessary types

/**
 * Interface for the data required to create a new application.
 * Updated to correctly include firstName and lastName.
 */
interface CreateApplicationData {
  firstName: string; // CORRECTED: Use firstName
  lastName: string; // CORRECTED: Use lastName
  email: string;
  yearsOfExperience: number; // CORRECTED: Expect number as it's parsed in controller
  highestEducation: string;
  jobPostingId: string;
  coverLetter?: string | null; // Allow null for optional fields
  cvFileName?: string | null; // Allow null for optional file names
  profilePictureFileName?: string | null; // Allow null for optional file names
}

/**
 * Service layer for handling job application business logic and database interactions.
 */
const applicationService = {
  /**
   * Submits a new job application.
   * Handles applicant upsert and application creation.
   * @param data The application data, including text fields and file names.
   * @returns The created application object.
   * @throws Throws an error if job posting is not found or if application already exists.
   */
  submitApplication: async (
    data: CreateApplicationData
  ): Promise<Application> => {
    const {
      firstName, // CORRECTED: Destructure firstName
      lastName, // CORRECTED: Destructure lastName
      email,
      yearsOfExperience,
      highestEducation,
      jobPostingId,
      coverLetter,
      cvFileName,
      profilePictureFileName,
    } = data;

    // Removed: const [firstName, ...lastNameParts] = fullName.split(" ");
    // Removed: const lastName = lastNameParts.join(" ");
    // The firstName and lastName are now directly available from 'data'

    // Use upsert to handle both new and existing applicants
    let applicant: Applicant;
    try {
      applicant = await db.applicant.upsert({
        where: { email },
        create: { firstName, lastName, email },
        update: { firstName, lastName }, // Update if applicant already exists
      });
    } catch (error: any) {
      // P2002 is Prisma's error code for unique constraint violation
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        throw new Error("An applicant with this email already exists.");
      }
      throw new Error(
        `Failed to create or update applicant: ${
          error.message || "Unknown error"
        }`
      );
    }

    // Check if the job posting exists
    const jobPosting: JobPosting | null = await db.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPosting) {
      const error = new Error("Job posting not found");
      (error as any).statusCode = 404; // Add statusCode for global error handler
      throw error;
    }

    // Check if applicant has already applied to this specific job posting
    const existingApplication = await db.application.findUnique({
      where: {
        jobPostingId_applicantId: {
          jobPostingId: jobPostingId,
          applicantId: applicant.id,
        },
      },
    });

    if (existingApplication) {
      const error = new Error("You have already applied for this job posting.");
      (error as any).statusCode = 409; // Conflict
      throw error;
    }

    // Create the application record
    const application: Application = await db.application.create({
      data: {
        jobPosting: { connect: { id: jobPostingId } }, // Use connect for relations
        applicant: { connect: { id: applicant.id } }, // Use connect for relations
        yearsOfExperience,
        highestEducation,
        coverLetter,
        cvFileName,
        profilePictureFileName,
        // applicationDate will default to now() due to @default(now()) in schema
      },
    });

    return application;
  },

  /**
   * Fetches all job applications with associated applicant and job posting details.
   * @returns An array of application objects.
   */
  getAllApplications: async (): Promise<Application[]> => {
    const applications = await db.application.findMany({
      include: { applicant: true, jobPosting: true }, // Include related data
    });
    return applications;
  },

  /**
   * Fetches all applications for a specific job posting ID.
   * Includes applicant and job posting details for comprehensive display.
   * @param jobPostingId The ID of the job posting.
   * @returns An array of application objects for the specified job posting.
   */
  getApplicationsByJobPostingId: async (
    jobPostingId: string
  ): Promise<Application[]> => {
    const applications = await db.application.findMany({
      where: {
        jobPostingId: jobPostingId,
      },
      include: {
        applicant: true, // Include applicant details
        jobPosting: true, // Include job posting details
      },
      orderBy: {
        createdAt: "asc", // Order by application date
      },
    });
    return applications;
  },
};

export default applicationService;
