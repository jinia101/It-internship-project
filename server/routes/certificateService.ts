import express, { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { body, param, validationResult } from "express-validator";
import { authenticateAdmin } from "./adminAuth";

const router = express.Router();
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  admin?: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// GET /api/certificate-services - Get all certificate services
router.get(
  "/",
  authenticateAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("Fetching certificate services for admin:", req.admin?.id);

      const certificateServices = await prisma.certificateService.findMany({
        include: {
          contacts: true,
          documents: true,
          processSteps: true,
          eligibilityItems: true,
          admin: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      console.log(`Found ${certificateServices.length} certificate services`);

      res.json({
        success: true,
        certificateServices,
      });
    } catch (error) {
      console.error("Error fetching certificate services:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch certificate services",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// GET /api/certificate-services/:id - Get specific certificate service
router.get(
  "/:id",
  authenticateAdmin,
  param("id").isInt().withMessage("ID must be a valid integer"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const id = parseInt(req.params.id);
      console.log(`Fetching certificate service with ID: ${id}`);

      const certificateService = await prisma.certificateService.findUnique({
        where: { id },
        include: {
          contacts: true,
          documents: true,
          admin: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!certificateService) {
        console.log(`Certificate service with ID ${id} not found`);
        return res.status(404).json({
          success: false,
          message: "Certificate service not found",
        });
      }

      console.log(`Found certificate service: ${certificateService.name}`);

      res.json({
        success: true,
        certificateService,
      });
    } catch (error) {
      console.error("Error fetching certificate service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch certificate service",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// POST /api/certificate-services - Create new certificate service
router.post(
  "/",
  authenticateAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("summary").notEmpty().withMessage("Summary is required"),
    body("applicationMode")
      .notEmpty()
      .withMessage("Application mode is required"),
    body("targetAudience")
      .isArray()
      .withMessage("Target audience must be an array"),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const adminId = req.admin!.id;
      console.log("Creating certificate service for admin:", adminId);
      console.log("Request body:", req.body);

      const {
        name,
        summary,
        type,
        targetAudience,
        applicationMode,
        onlineUrl,
        offlineAddress,
      } = req.body;

      const certificateService = await prisma.certificateService.create({
        data: {
          name,
          summary,
          type,
          targetAudience,
          applicationMode,
          onlineUrl,
          offlineAddress,
          status: "draft",
          adminId,
          eligibilityDetails: [],
          certificateDetails: [],
          processDetails: [],
        },
        include: {
          contacts: true,
          documents: true,
          admin: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      console.log(
        "Certificate service created successfully:",
        certificateService.id,
      );

      res.status(201).json({
        success: true,
        certificateService,
        message: "Certificate service created successfully",
      });
    } catch (error) {
      console.error("Error creating certificate service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create certificate service",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// PATCH /api/certificate-services/:id - Update certificate service
router.patch(
  "/:id",
  authenticateAdmin,
  param("id").isInt().withMessage("ID must be a valid integer"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const id = parseInt(req.params.id);
      console.log(`Updating certificate service with ID: ${id}`);
      console.log("Update data:", req.body);

      // Check if certificate service exists
      const existingService = await prisma.certificateService.findUnique({
        where: { id },
      });

      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: "Certificate service not found",
        });
      }

      // Extract relationship fields and nested data that shouldn't be directly updated
      const {
        contacts,
        documents,
        processSteps,
        eligibilityItems,
        admin,
        createdAt,
        updatedAt,
        id: bodyId,
        ...updateData
      } = req.body;

      let prismaUpdateData: any = updateData;

      // If contacts are provided, handle them with Prisma's nested operations
      if (contacts && Array.isArray(contacts)) {
        prismaUpdateData.contacts = {
          deleteMany: {}, // Clear existing contacts
          create: contacts.map((contact: any) => ({
            serviceName: contact.serviceName || updateData.name,
            name: contact.name,
            designation: contact.designation,
            contact: contact.contact,
            email: contact.email || "",
            district: contact.district,
            subDistrict: contact.subDistrict || "",
            block: contact.block || "",
            applicationType: contact.applicationType || "New Application",
          })),
        };
      }

      // Handle documents if provided
      if (documents && Array.isArray(documents)) {
        prismaUpdateData.documents = {
          deleteMany: {}, // Clear existing documents
          create: documents.map((doc: any) => ({
            slNo: doc.slNo || 1,
            documentType: doc.documentType,
            validProof: doc.validProof,
            applicationType: doc.applicationType || "New Application",
          })),
        };
      }

      // Handle process steps if provided
      if (processSteps && Array.isArray(processSteps)) {
        prismaUpdateData.processSteps = {
          deleteMany: {}, // Clear existing process steps
          create: processSteps.map((step: any) => ({
            slNo: step.slNo || 1,
            stepDetails: step.stepDetails,
            applicationType: step.applicationType || "New Application",
          })),
        };
      }

      // Handle eligibility items if provided
      if (eligibilityItems && Array.isArray(eligibilityItems)) {
        prismaUpdateData.eligibilityItems = {
          deleteMany: {}, // Clear existing eligibility items
          create: eligibilityItems.map((item: any) => ({
            eligibilityDetail: item.eligibilityDetail,
            applicationType: item.applicationType || "New Application",
          })),
        };
      }

      const updatedService = await prisma.certificateService.update({
        where: { id },
        data: prismaUpdateData,
        include: {
          contacts: true,
          documents: true,
          processSteps: true,
          eligibilityItems: true,
          admin: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      console.log("Certificate service updated successfully");

      res.json({
        success: true,
        certificateService: updatedService,
        message: "Certificate service updated successfully",
      });
    } catch (error) {
      console.error("Error updating certificate service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update certificate service",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// PATCH /api/certificate-services/:id/publish - Publish certificate service
router.patch(
  "/:id/publish",
  authenticateAdmin,
  param("id").isInt().withMessage("ID must be a valid integer"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const id = parseInt(req.params.id);
      console.log(`Publishing certificate service with ID: ${id}`);

      const existingService = await prisma.certificateService.findUnique({
        where: { id },
      });

      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: "Certificate service not found",
        });
      }

      const publishedService = await prisma.certificateService.update({
        where: { id },
        data: { status: "published" },
        include: {
          contacts: true,
          documents: true,
          admin: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      console.log("Certificate service published successfully");

      res.json({
        success: true,
        certificateService: publishedService,
        message: "Certificate service published successfully",
      });
    } catch (error) {
      console.error("Error publishing certificate service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to publish certificate service",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// DELETE /api/certificate-services/:id - Delete certificate service
router.delete(
  "/:id",
  authenticateAdmin,
  param("id").isInt().withMessage("ID must be a valid integer"),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const id = parseInt(req.params.id);
      console.log(`Deleting certificate service with ID: ${id}`);

      const existingService = await prisma.certificateService.findUnique({
        where: { id },
      });

      if (!existingService) {
        return res.status(404).json({
          success: false,
          message: "Certificate service not found",
        });
      }

      await prisma.certificateService.delete({
        where: { id },
      });

      console.log("Certificate service deleted successfully");

      res.json({
        success: true,
        message: "Certificate service deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting certificate service:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete certificate service",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

export default router;
