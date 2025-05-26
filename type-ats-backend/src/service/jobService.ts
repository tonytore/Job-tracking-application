// src/service/jobService.ts
import { db } from "../db/db";
import { JobPosting, Prisma } from "@prisma/client"; // Import Prisma for specific types if needed

interface CreateJobPostingData {
  title: string;
  description?: string;
  requiredSkills: string[];
  department: string;
  closingDate: Date;
}

// Define an interface for the filters
interface JobPostingFilters {
  title?: string;
  department?: string;
  skills?: string[];
}
interface CreateJobPostingData {
  title: string;
  description?: string;
  requiredSkills: string[];
  department: string;
  closingDate: Date;
}

// Define a type for partial updates
type UpdateJobPostingData = Prisma.JobPostingUpdateInput; // Use Prisma's generated type for update inputs

const jobService = {
  /**
   * Creates a new job posting in the database.
   * @param data The job posting data.
   * @returns The newly created job posting.
   */
  createJobPosting: async (data: CreateJobPostingData): Promise<JobPosting> => {
    const { title, description, requiredSkills, department, closingDate } =
      data;
    const job = await db.jobPosting.create({
      data: {
        title,
        description,
        requiredSkills,
        department,
        closingDate,
      },
    });
    return job;
  },

  /**
   * Fetches all job postings from the database.
   * @returns An array of job postings.
   */
  getAllJobPostings: async (
    filters?: JobPostingFilters
  ): Promise<JobPosting[]> => {
    // UPDATED signature
    const whereClause: Prisma.JobPostingWhereInput = {};

    if (filters?.title) {
      whereClause.title = {
        contains: filters.title,
        mode: "insensitive", // Case-insensitive search
      };
    }

    if (filters?.department) {
      whereClause.department = {
        contains: filters.department, // Use 'contains' for partial match, 'equals' for exact
        mode: "insensitive",
      };
    }

    if (filters?.skills && filters.skills.length > 0) {
      // Find jobs where the 'requiredSkills' array contains AT LEAST ONE of the provided skills.
      // Prisma's `hasSome` is perfect for this on a String[] field.
      whereClause.requiredSkills = {
        hasSome: filters.skills,
      };
      // Note: `hasSome` is case-sensitive. For case-insensitivity on skills,
      // you'd typically store skills in a normalized (e.g., lowercase) format,
      // or fetch all, then filter in memory (less efficient), or use a full-text search solution.
      // For this task, `hasSome` is the direct Prisma approach.
    }

    const jobs = await db.jobPosting.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc", // Keep a consistent order
      },
    });
    return jobs;
  },

  /**
   * Fetches a single job posting by its ID from the database.
   * @param id The ID of the job posting to fetch.
   * @returns The job posting if found, otherwise null.
   */
  getJobPostingById: async (id: string): Promise<JobPosting | null> => {
    const job = await db.jobPosting.findUnique({
      where: { id: id },
    });
    return job;
  },

  /**
   * Updates an existing job posting by its ID.
   * @param id The ID of the job posting to update.
   * @param data The data to update.
   * @returns The updated job posting, or null if not found.
   */
  updateJobPosting: async (
    id: string,
    data: UpdateJobPostingData
  ): Promise<JobPosting | null> => {
    try {
      const updatedJob = await db.jobPosting.update({
        where: { id },
        data,
      });
      return updatedJob;
    } catch (error: any) {
      // Handle case where ID might not exist (P2025: Record not found)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null; // Or throw a specific error that the controller can catch
      }
      throw error; // Re-throw other errors
    }
  },

  /**
   * Deletes a job posting by its ID.
   * @param id The ID of the job posting to delete.
   * @returns The deleted job posting, or null if not found.
   */
  deleteJobPosting: async (id: string): Promise<JobPosting | null> => {
    try {
      const deletedJob = await db.jobPosting.delete({
        where: { id },
      });
      return deletedJob;
    } catch (error: any) {
      // Handle case where ID might not exist (P2025: Record not found)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null; // Or throw a specific error that the controller can catch
      }
      throw error; // Re-throw other errors
    }
  },

  /**
   * Retrieves analytics data for job postings, including applicant counts.
   * @returns An array of job postings with their applicant counts.
   */
  getJobPostingAnalytics: async () => {
    const jobsWithApplications = await db.jobPosting.findMany({
      include: {
        applications: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const analyticsData = jobsWithApplications.map((job) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      closingDate: job.closingDate,
      totalApplicants: job.applications.length,
    }));

    return analyticsData;
  },
};

export default jobService;
