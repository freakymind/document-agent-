// Mock external system API - simulates fetching data from another system
import type { ExternalApplication, ExternalDocument, ApplicationType } from "./types"

export const applicationTypes: ApplicationType[] = [
  {
    id: "1",
    code: "personal_account",
    name: "Personal Account Opening",
    description: "Standard personal banking account",
    requiredDocuments: ["passport", "utility_bill", "bank_statement"],
  },
  {
    id: "2",
    code: "business_account",
    name: "Business Account Opening",
    description: "Business/Corporate banking account",
    requiredDocuments: ["business_registration", "tax_certificate", "director_id", "utility_bill"],
  },
  {
    id: "3",
    code: "loan_application",
    name: "Loan Application",
    description: "Personal or business loan",
    requiredDocuments: ["passport", "bank_statement", "tax_return", "salary_slip"],
  },
  {
    id: "4",
    code: "credit_card",
    name: "Credit Card Application",
    description: "Credit card application",
    requiredDocuments: ["passport", "salary_slip", "bank_statement"],
  },
]

// Mock applications in the external system
const mockApplications: Record<string, ExternalApplication> = {
  "APP-2025-001234": {
    applicationNumber: "APP-2025-001234",
    applicationType: "personal_account",
    applicantName: "John Smith",
    applicantEmail: "john.smith@email.com",
    applicantPhone: "+1 555-0123",
    applicantDob: "1990-05-15",
    applicantAddress: "123 Main Street, New York, NY 10001",
    submittedAt: "2025-01-15T10:30:00Z",
    status: "pending_verification",
  },
  "APP-2025-001235": {
    applicationNumber: "APP-2025-001235",
    applicationType: "business_account",
    applicantName: "Jane Doe",
    applicantEmail: "jane.doe@company.com",
    applicantPhone: "+1 555-0456",
    applicantDob: "1985-08-22",
    applicantAddress: "456 Business Ave, Los Angeles, CA 90001",
    submittedAt: "2025-01-14T14:20:00Z",
    status: "pending_verification",
  },
  "APP-2025-001236": {
    applicationNumber: "APP-2025-001236",
    applicationType: "loan_application",
    applicantName: "Robert Johnson",
    applicantEmail: "robert.j@email.com",
    applicantPhone: "+1 555-0789",
    applicantDob: "1978-12-03",
    applicantAddress: "789 Oak Lane, Chicago, IL 60601",
    submittedAt: "2025-01-13T09:15:00Z",
    status: "pending_verification",
  },
}

// Mock documents uploaded to the external system
const mockDocuments: Record<string, ExternalDocument[]> = {
  "APP-2025-001234": [
    {
      id: "doc-001",
      applicationNumber: "APP-2025-001234",
      fileName: "john_passport_scan.pdf",
      fileUrl: "/passport-scan.png",
      fileSize: 245000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:35:00Z",
      metadata: {
        documentCategory: "identity",
        documentLabel: "Passport",
        sourceSystem: "mobile_app",
      },
    },
    {
      id: "doc-002",
      applicationNumber: "APP-2025-001234",
      fileName: "electric_bill_dec2024.pdf",
      fileUrl: "/generic-utility-bill.png",
      fileSize: 128000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:36:00Z",
      metadata: {
        documentCategory: "address_proof",
        documentLabel: "Utility Bill",
        sourceSystem: "mobile_app",
      },
    },
    {
      id: "doc-003",
      applicationNumber: "APP-2025-001234",
      fileName: "bank_statement_q4_2024.pdf",
      fileUrl: "/generic-bank-statement.png",
      fileSize: 356000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:37:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Bank Statement",
        sourceSystem: "mobile_app",
      },
    },
  ],
  "APP-2025-001235": [
    {
      id: "doc-004",
      applicationNumber: "APP-2025-001235",
      fileName: "company_registration.pdf",
      fileUrl: "/business-registration-certificate.jpg",
      fileSize: 512000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:25:00Z",
      metadata: {
        documentCategory: "business",
        documentLabel: "Business Registration",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-005",
      applicationNumber: "APP-2025-001235",
      fileName: "tax_certificate_2024.pdf",
      fileUrl: "/tax-certificate-document.png",
      fileSize: 189000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:26:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Tax Certificate",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-006",
      applicationNumber: "APP-2025-001235",
      fileName: "director_passport.jpg",
      fileUrl: "/passport-id-photo.jpg",
      fileSize: 98000,
      mimeType: "image/jpeg",
      uploadedAt: "2025-01-14T14:27:00Z",
      metadata: {
        documentCategory: "identity",
        documentLabel: "Director ID",
        sourceSystem: "web_portal",
      },
    },
    // Missing utility bill - incomplete submission
  ],
  "APP-2025-001236": [
    {
      id: "doc-007",
      applicationNumber: "APP-2025-001236",
      fileName: "passport_robert.pdf",
      fileUrl: "/passport-document.png",
      fileSize: 267000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:20:00Z",
      metadata: {
        documentCategory: "identity",
        documentLabel: "Passport",
        sourceSystem: "branch_upload",
      },
    },
    {
      id: "doc-008",
      applicationNumber: "APP-2025-001236",
      fileName: "6month_bank_statement.pdf",
      fileUrl: "/bank-statement-financial-document.jpg",
      fileSize: 445000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:21:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Bank Statement",
        sourceSystem: "branch_upload",
      },
    },
    {
      id: "doc-009",
      applicationNumber: "APP-2025-001236",
      fileName: "tax_return_2024.pdf",
      fileUrl: "/tax-return-form-document.jpg",
      fileSize: 678000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:22:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Tax Return",
        sourceSystem: "branch_upload",
      },
    },
    {
      id: "doc-010",
      applicationNumber: "APP-2025-001236",
      fileName: "salary_slip_dec2024.pdf",
      fileUrl: "/salary-slip-payroll-document.jpg",
      fileSize: 89000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:23:00Z",
      metadata: {
        documentCategory: "income",
        documentLabel: "Salary Slip",
        sourceSystem: "branch_upload",
      },
    },
  ],
}

// Simulated API calls to external system
export async function fetchApplication(applicationNumber: string): Promise<ExternalApplication | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return mockApplications[applicationNumber] || null
}

export async function fetchApplicationDocuments(applicationNumber: string): Promise<ExternalDocument[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return mockDocuments[applicationNumber] || []
}

export function getApplicationType(code: string): ApplicationType | undefined {
  return applicationTypes.find((t) => t.code === code)
}

// Document type mapping based on metadata
const documentTypeMapping: Record<string, string> = {
  Passport: "passport",
  "Driver License": "driver_license",
  "National ID": "national_id",
  "Utility Bill": "utility_bill",
  "Bank Statement": "bank_statement",
  "Tax Return": "tax_return",
  "Tax Certificate": "tax_certificate",
  "Salary Slip": "salary_slip",
  "Business Registration": "business_registration",
  "Director ID": "director_id",
}

export function mapDocumentToType(doc: ExternalDocument): { typeCode: string; confidence: number; reason: string } {
  const label = doc.metadata.documentLabel || ""

  // Try exact match first
  if (documentTypeMapping[label]) {
    return {
      typeCode: documentTypeMapping[label],
      confidence: 95,
      reason: `Matched by document label: "${label}"`,
    }
  }

  // Fallback to category-based matching
  const category = doc.metadata.documentCategory || ""
  const fileName = doc.fileName.toLowerCase()

  if (category === "identity" || fileName.includes("passport")) {
    return { typeCode: "passport", confidence: 75, reason: "Inferred from category/filename" }
  }
  if (category === "financial" || fileName.includes("bank") || fileName.includes("statement")) {
    return { typeCode: "bank_statement", confidence: 70, reason: "Inferred from category/filename" }
  }
  if (category === "address_proof" || fileName.includes("bill") || fileName.includes("utility")) {
    return { typeCode: "utility_bill", confidence: 70, reason: "Inferred from category/filename" }
  }
  if (category === "income" || fileName.includes("salary") || fileName.includes("payslip")) {
    return { typeCode: "salary_slip", confidence: 70, reason: "Inferred from category/filename" }
  }

  return { typeCode: "unknown", confidence: 30, reason: "Could not determine document type" }
}

// Get sample application numbers for demo
export function getSampleApplicationNumbers(): string[] {
  return Object.keys(mockApplications)
}
