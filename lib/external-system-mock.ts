// Mock external system API - simulates fetching data from another system
// UK Commercial & Institutional Banking Onboarding
import type { ExternalApplication, ExternalDocument, ApplicationType } from "./types"

// Customer Complexity Levels for UK Commercial Banking
export type CustomerComplexity = "standard" | "complex" | "high_risk"

export const applicationTypes: ApplicationType[] = [
  // Standard Complexity - SME & Small Corporate
  {
    id: "1",
    code: "sme_current_account",
    name: "SME Business Current Account",
    description: "Standard current account for UK small/medium enterprises (turnover < £10M)",
    requiredDocuments: [
      "certificate_of_incorporation",
      "memorandum_articles",
      "director_id",
      "proof_of_address_business",
      "bank_statements_6m",
    ],
  },
  {
    id: "2",
    code: "corporate_current_account",
    name: "Corporate Current Account",
    description: "Business current account for UK corporates (turnover £10M-£50M)",
    requiredDocuments: [
      "certificate_of_incorporation",
      "memorandum_articles",
      "annual_accounts",
      "director_id",
      "ubo_declaration",
      "proof_of_address_business",
      "bank_statements_12m",
      "board_resolution",
    ],
  },
  // Complex Customers - Large Corporate & Institutional
  {
    id: "3",
    code: "institutional_account",
    name: "Institutional Client Account",
    description: "Account for financial institutions, funds, pension schemes",
    requiredDocuments: [
      "certificate_of_incorporation",
      "memorandum_articles",
      "fca_registration",
      "annual_accounts",
      "audited_financials",
      "director_id",
      "ubo_declaration",
      "kyc_questionnaire",
      "aml_policy",
      "board_resolution",
      "legal_entity_identifier",
    ],
  },
  {
    id: "4",
    code: "trade_finance",
    name: "Trade Finance Facility",
    description: "Import/Export financing, Letters of Credit, Trade Guarantees",
    requiredDocuments: [
      "certificate_of_incorporation",
      "memorandum_articles",
      "annual_accounts",
      "audited_financials",
      "director_id",
      "ubo_declaration",
      "trade_references",
      "supplier_contracts",
      "bank_statements_12m",
      "board_resolution",
      "sanctions_screening",
    ],
  },
  // High Risk - Enhanced Due Diligence
  {
    id: "5",
    code: "pep_corporate",
    name: "PEP-Connected Corporate",
    description: "Corporates with Politically Exposed Person connections",
    requiredDocuments: [
      "certificate_of_incorporation",
      "memorandum_articles",
      "annual_accounts",
      "audited_financials",
      "director_id",
      "ubo_declaration",
      "pep_declaration",
      "source_of_wealth",
      "source_of_funds",
      "enhanced_due_diligence",
      "board_resolution",
      "sanctions_screening",
      "adverse_media_report",
    ],
  },
  {
    id: "6",
    code: "offshore_entity",
    name: "Offshore Entity Account",
    description: "Non-UK incorporated entities seeking UK banking",
    requiredDocuments: [
      "certificate_of_incorporation",
      "memorandum_articles",
      "certificate_of_good_standing",
      "tax_residency_certificate",
      "annual_accounts",
      "audited_financials",
      "director_id",
      "ubo_declaration",
      "source_of_wealth",
      "source_of_funds",
      "legal_opinion",
      "board_resolution",
      "sanctions_screening",
    ],
  },
]

// Mock applications in the external system - UK Commercial & Institutional
const mockApplications: Record<string, ExternalApplication> = {
  "NWB-2025-SME-0042": {
    applicationNumber: "NWB-2025-SME-0042",
    applicationType: "sme_current_account",
    applicantName: "Northfield Engineering Ltd",
    applicantEmail: "accounts@northfield-eng.co.uk",
    applicantPhone: "+44 20 7946 0958",
    applicantDob: null, // Company incorporation date handled separately
    applicantAddress: "Unit 7, Thames Industrial Estate, Reading, RG1 4QP",
    submittedAt: "2025-01-15T10:30:00Z",
    status: "pending_verification",
  },
  "NWB-2025-CORP-0089": {
    applicationNumber: "NWB-2025-CORP-0089",
    applicationType: "corporate_current_account",
    applicantName: "Sterling Manufacturing Group PLC",
    applicantEmail: "treasury@sterlingmfg.co.uk",
    applicantPhone: "+44 161 496 0832",
    applicantDob: null,
    applicantAddress: "Sterling House, 45 Victoria Street, Manchester, M3 1WA",
    submittedAt: "2025-01-14T14:20:00Z",
    status: "pending_verification",
  },
  "NWB-2025-INST-0015": {
    applicationNumber: "NWB-2025-INST-0015",
    applicationType: "institutional_account",
    applicantName: "Apex Capital Partners LLP",
    applicantEmail: "compliance@apexcapital.co.uk",
    applicantPhone: "+44 20 7123 4567",
    applicantDob: null,
    applicantAddress: "One Canada Square, Canary Wharf, London, E14 5AB",
    submittedAt: "2025-01-13T09:15:00Z",
    status: "pending_verification",
  },
}

// Mock documents uploaded to the external system - UK Commercial Documents
const mockDocuments: Record<string, ExternalDocument[]> = {
  "NWB-2025-SME-0042": [
    {
      id: "doc-001",
      applicationNumber: "NWB-2025-SME-0042",
      fileName: "northfield_certificate_of_incorporation.pdf",
      fileUrl: "/business-registration-certificate.jpg",
      fileSize: 245000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:35:00Z",
      metadata: {
        documentCategory: "corporate",
        documentLabel: "Certificate of Incorporation",
        sourceSystem: "companies_house_api",
      },
    },
    {
      id: "doc-002",
      applicationNumber: "NWB-2025-SME-0042",
      fileName: "northfield_mem_and_arts.pdf",
      fileUrl: "/tax-certificate-document.png",
      fileSize: 512000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:36:00Z",
      metadata: {
        documentCategory: "corporate",
        documentLabel: "Memorandum and Articles",
        sourceSystem: "companies_house_api",
      },
    },
    {
      id: "doc-003",
      applicationNumber: "NWB-2025-SME-0042",
      fileName: "director_james_wilson_passport.pdf",
      fileUrl: "/passport-scan.png",
      fileSize: 128000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:37:00Z",
      metadata: {
        documentCategory: "identity",
        documentLabel: "Director ID",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-004",
      applicationNumber: "NWB-2025-SME-0042",
      fileName: "business_utility_bill_dec2024.pdf",
      fileUrl: "/generic-utility-bill.png",
      fileSize: 89000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:38:00Z",
      metadata: {
        documentCategory: "address_proof",
        documentLabel: "Proof of Address (Business)",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-005",
      applicationNumber: "NWB-2025-SME-0042",
      fileName: "barclays_statements_jul_dec_2024.pdf",
      fileUrl: "/generic-bank-statement.png",
      fileSize: 356000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-15T10:39:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Bank Statements (6 months)",
        sourceSystem: "web_portal",
      },
    },
  ],
  "NWB-2025-CORP-0089": [
    {
      id: "doc-006",
      applicationNumber: "NWB-2025-CORP-0089",
      fileName: "sterling_certificate_of_incorporation.pdf",
      fileUrl: "/business-registration-certificate.jpg",
      fileSize: 267000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:25:00Z",
      metadata: {
        documentCategory: "corporate",
        documentLabel: "Certificate of Incorporation",
        sourceSystem: "companies_house_api",
      },
    },
    {
      id: "doc-007",
      applicationNumber: "NWB-2025-CORP-0089",
      fileName: "sterling_mem_and_arts.pdf",
      fileUrl: "/tax-certificate-document.png",
      fileSize: 678000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:26:00Z",
      metadata: {
        documentCategory: "corporate",
        documentLabel: "Memorandum and Articles",
        sourceSystem: "companies_house_api",
      },
    },
    {
      id: "doc-008",
      applicationNumber: "NWB-2025-CORP-0089",
      fileName: "sterling_annual_accounts_2024.pdf",
      fileUrl: "/bank-statement-financial-document.jpg",
      fileSize: 1245000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:27:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Annual Accounts",
        sourceSystem: "companies_house_api",
      },
    },
    {
      id: "doc-009",
      applicationNumber: "NWB-2025-CORP-0089",
      fileName: "director_sarah_thompson_passport.pdf",
      fileUrl: "/passport-id-photo.jpg",
      fileSize: 98000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:28:00Z",
      metadata: {
        documentCategory: "identity",
        documentLabel: "Director ID",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-010",
      applicationNumber: "NWB-2025-CORP-0089",
      fileName: "sterling_ubo_declaration.pdf",
      fileUrl: "/tax-return-form-document.jpg",
      fileSize: 156000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-14T14:29:00Z",
      metadata: {
        documentCategory: "compliance",
        documentLabel: "UBO Declaration",
        sourceSystem: "web_portal",
      },
    },
    // Missing: proof_of_address_business, bank_statements_12m, board_resolution
  ],
  "NWB-2025-INST-0015": [
    {
      id: "doc-011",
      applicationNumber: "NWB-2025-INST-0015",
      fileName: "apex_certificate_of_incorporation.pdf",
      fileUrl: "/business-registration-certificate.jpg",
      fileSize: 189000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:20:00Z",
      metadata: {
        documentCategory: "corporate",
        documentLabel: "Certificate of Incorporation",
        sourceSystem: "companies_house_api",
      },
    },
    {
      id: "doc-012",
      applicationNumber: "NWB-2025-INST-0015",
      fileName: "apex_llp_agreement.pdf",
      fileUrl: "/tax-certificate-document.png",
      fileSize: 890000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:21:00Z",
      metadata: {
        documentCategory: "corporate",
        documentLabel: "Memorandum and Articles",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-013",
      applicationNumber: "NWB-2025-INST-0015",
      fileName: "apex_fca_registration.pdf",
      fileUrl: "/salary-slip-payroll-document.jpg",
      fileSize: 156000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:22:00Z",
      metadata: {
        documentCategory: "regulatory",
        documentLabel: "FCA Registration",
        sourceSystem: "fca_api",
      },
    },
    {
      id: "doc-014",
      applicationNumber: "NWB-2025-INST-0015",
      fileName: "apex_audited_accounts_2024.pdf",
      fileUrl: "/bank-statement-financial-document.jpg",
      fileSize: 2450000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:23:00Z",
      metadata: {
        documentCategory: "financial",
        documentLabel: "Audited Financials",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-015",
      applicationNumber: "NWB-2025-INST-0015",
      fileName: "partner_michael_chen_passport.pdf",
      fileUrl: "/passport-document.png",
      fileSize: 134000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:24:00Z",
      metadata: {
        documentCategory: "identity",
        documentLabel: "Director ID",
        sourceSystem: "web_portal",
      },
    },
    {
      id: "doc-016",
      applicationNumber: "NWB-2025-INST-0015",
      fileName: "apex_ubo_declaration.pdf",
      fileUrl: "/tax-return-form-document.jpg",
      fileSize: 178000,
      mimeType: "application/pdf",
      uploadedAt: "2025-01-13T09:25:00Z",
      metadata: {
        documentCategory: "compliance",
        documentLabel: "UBO Declaration",
        sourceSystem: "web_portal",
      },
    },
    // Missing: annual_accounts, kyc_questionnaire, aml_policy, board_resolution, legal_entity_identifier
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

// UK Commercial Banking Document Type Mapping
const documentTypeMapping: Record<string, string> = {
  // Corporate Documents
  "Certificate of Incorporation": "certificate_of_incorporation",
  "Memorandum and Articles": "memorandum_articles",
  "Certificate of Good Standing": "certificate_of_good_standing",
  "Board Resolution": "board_resolution",
  "Legal Entity Identifier": "legal_entity_identifier",
  // Identity & KYC
  "Director ID": "director_id",
  Passport: "director_id",
  "UBO Declaration": "ubo_declaration",
  "KYC Questionnaire": "kyc_questionnaire",
  // Financial Documents
  "Annual Accounts": "annual_accounts",
  "Audited Financials": "audited_financials",
  "Bank Statements (6 months)": "bank_statements_6m",
  "Bank Statements (12 months)": "bank_statements_12m",
  // Address & Proof
  "Proof of Address (Business)": "proof_of_address_business",
  "Utility Bill": "proof_of_address_business",
  // Regulatory
  "FCA Registration": "fca_registration",
  "Tax Residency Certificate": "tax_residency_certificate",
  // Compliance
  "AML Policy": "aml_policy",
  "Source of Wealth": "source_of_wealth",
  "Source of Funds": "source_of_funds",
  "PEP Declaration": "pep_declaration",
  "Enhanced Due Diligence": "enhanced_due_diligence",
  "Sanctions Screening": "sanctions_screening",
  "Adverse Media Report": "adverse_media_report",
  "Legal Opinion": "legal_opinion",
  // Trade Finance
  "Trade References": "trade_references",
  "Supplier Contracts": "supplier_contracts",
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

  if (category === "corporate" || fileName.includes("incorporation") || fileName.includes("certificate")) {
    return { typeCode: "certificate_of_incorporation", confidence: 75, reason: "Inferred from corporate category/filename" }
  }
  if (fileName.includes("mem") && fileName.includes("art")) {
    return { typeCode: "memorandum_articles", confidence: 80, reason: "Inferred from filename pattern" }
  }
  if (category === "identity" || fileName.includes("passport") || fileName.includes("director")) {
    return { typeCode: "director_id", confidence: 75, reason: "Inferred from identity category/filename" }
  }
  if (category === "financial" || fileName.includes("account") || fileName.includes("financial")) {
    return { typeCode: "annual_accounts", confidence: 70, reason: "Inferred from financial category" }
  }
  if (fileName.includes("statement") && fileName.includes("bank")) {
    return { typeCode: "bank_statements_6m", confidence: 70, reason: "Inferred from bank statement filename" }
  }
  if (category === "address_proof" || fileName.includes("utility") || fileName.includes("bill")) {
    return { typeCode: "proof_of_address_business", confidence: 70, reason: "Inferred from address proof category" }
  }
  if (category === "compliance" || fileName.includes("ubo")) {
    return { typeCode: "ubo_declaration", confidence: 75, reason: "Inferred from compliance category" }
  }
  if (category === "regulatory" || fileName.includes("fca")) {
    return { typeCode: "fca_registration", confidence: 80, reason: "Inferred from regulatory category" }
  }
  if (fileName.includes("audit")) {
    return { typeCode: "audited_financials", confidence: 80, reason: "Inferred from audit filename" }
  }

  return { typeCode: "unknown", confidence: 30, reason: "Could not determine document type" }
}

// Get sample application numbers for demo
export function getSampleApplicationNumbers(): string[] {
  return Object.keys(mockApplications)
}
