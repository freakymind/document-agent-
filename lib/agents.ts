// Document Intelligence Agents

import type {
  ExternalApplication,
  ExternalDocument,
  ApplicationType,
  InitialCheckResult,
  ValidationResult,
  FieldDiscrepancy,
  FinalSummary,
} from "./types"
import { applicationTypes, mapDocumentToType } from "./external-system-mock"
import { generateMockExtraction } from "./mock-data"

// Agent 1: Initial Check Agent
// Analyzes application details, determines required documents, checks if all uploaded
export async function runInitialCheckAgent(
  application: ExternalApplication,
  documents: ExternalDocument[]
): Promise<InitialCheckResult> {
  // Simulate agent processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get application type configuration
  const appType = applicationTypes.find((t) => t.code === application.applicationType)
  
  if (!appType) {
    return {
      applicationNumber: application.applicationNumber,
      applicationType: application.applicationType,
      applicationTypeName: "Unknown Application Type",
      requiredDocuments: [],
      completenessScore: 0,
      missingCount: 0,
      presentCount: 0,
      recommendation: "error",
    }
  }

  // Map uploaded documents to their types
  const uploadedDocMappings = documents.map((doc) => ({
    document: doc,
    mapping: mapDocumentToType(doc),
  }))

  // Check each required document
  const requiredDocuments = appType.requiredDocuments.map((reqCode) => {
    const matched = uploadedDocMappings.find((m) => m.mapping.typeCode === reqCode)
    return {
      code: reqCode,
      name: formatDocumentCode(reqCode),
      isPresent: !!matched,
      matchedDocument: matched?.document,
      confidence: matched?.mapping.confidence,
    }
  })

  const presentCount = requiredDocuments.filter((d) => d.isPresent).length
  const missingCount = requiredDocuments.filter((d) => !d.isPresent).length
  const completenessScore = (presentCount / requiredDocuments.length) * 100

  let recommendation: "proceed" | "missing_documents" | "error"
  if (completenessScore === 100) {
    recommendation = "proceed"
  } else if (completenessScore >= 50) {
    recommendation = "missing_documents"
  } else {
    recommendation = "error"
  }

  return {
    applicationNumber: application.applicationNumber,
    applicationType: application.applicationType,
    applicationTypeName: appType.name,
    requiredDocuments,
    completenessScore,
    missingCount,
    presentCount,
    recommendation,
  }
}

// Agent 2: Validation Agent
// Compares extracted data with application form values, checks document expiry, highlights discrepancies
export async function runValidationAgent(
  application: ExternalApplication,
  documents: ExternalDocument[],
  extractedDataByDoc: Record<string, Record<string, { value: string; confidence: number }>>
): Promise<ValidationResult> {
  // Simulate agent processing time
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const discrepancies: FieldDiscrepancy[] = []
  const expiredDocuments: ValidationResult["expiredDocuments"] = []
  let totalFieldsChecked = 0
  let matchedFields = 0

  // Define which application fields map to which document fields
  const fieldMappings = [
    {
      appField: "applicantName",
      appLabel: "Company/Director Name",
      docFields: ["full_name", "holder_name", "account_holder", "employee_name", "company_name", "director_name", "entity_name"],
    },
    {
      appField: "applicantDob",
      appLabel: "Date of Birth / Incorporation Date",
      docFields: ["date_of_birth", "dob", "incorporation_date"],
    },
    {
      appField: "applicantAddress",
      appLabel: "Registered/Business Address",
      docFields: ["address", "service_address", "registered_address", "business_address"],
    },
    {
      appField: "applicantEmail",
      appLabel: "Email Address",
      docFields: ["email", "contact_email"],
    },
    {
      appField: "applicantPhone",
      appLabel: "Phone Number",
      docFields: ["phone", "telephone", "contact_number"],
    },
  ]

  // Check each document's extracted data against application
  for (const doc of documents) {
    const mapping = mapDocumentToType(doc)
    const extractedData = extractedDataByDoc[doc.id] || generateMockExtraction(mapping.typeCode, application.applicantName)

    // Check for document expiry
    if (extractedData.expiry_date || extractedData.valid_until || extractedData.issue_date) {
      const expiryDate = extractedData.expiry_date?.value || extractedData.valid_until?.value
      const issueDate = extractedData.issue_date?.value

      if (expiryDate) {
        const expiry = new Date(expiryDate)
        const today = new Date()
        const daysExpired = Math.floor((today.getTime() - expiry.getTime()) / (1000 * 60 * 60 * 24))

        if (daysExpired > 0) {
          expiredDocuments.push({
            documentId: doc.id,
            documentName: doc.fileName,
            documentType: formatDocumentCode(mapping.typeCode),
            expiryDate,
            daysExpired,
          })

          // Add as critical discrepancy
          discrepancies.push({
            id: `disc-expired-${doc.id}`,
            fieldName: "expiry_date",
            fieldLabel: "Document Expiry",
            applicationValue: "Valid document required",
            documentValue: `Expired ${daysExpired} days ago (${expiryDate})`,
            documentSource: doc.fileName,
            documentType: formatDocumentCode(mapping.typeCode),
            severity: "critical",
            status: "open",
          })
        }
      } else if (issueDate && (mapping.typeCode === "proof_of_address_business" || mapping.typeCode === "bank_statements_6m" || mapping.typeCode === "bank_statements_12m")) {
        // For address proofs and bank statements, check if older than 3 months
        const issue = new Date(issueDate)
        const today = new Date()
        const monthsOld = Math.floor((today.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24 * 30))

        if (monthsOld > 3) {
          discrepancies.push({
            id: `disc-old-${doc.id}`,
            fieldName: "issue_date",
            fieldLabel: "Document Age",
            applicationValue: "Document must be less than 3 months old",
            documentValue: `Issued ${monthsOld} months ago (${issueDate})`,
            documentSource: doc.fileName,
            documentType: formatDocumentCode(mapping.typeCode),
            severity: "warning",
            status: "open",
          })
        }
      }
    }

    // Check field matches
    for (const fieldMap of fieldMappings) {
      const appValue = application[fieldMap.appField as keyof ExternalApplication] as string | null

      for (const docField of fieldMap.docFields) {
        if (extractedData[docField]) {
          totalFieldsChecked++
          const docValue = extractedData[docField].value
          const confidence = extractedData[docField].confidence

          // Check for discrepancy
          const isMatch = compareValues(appValue, docValue, fieldMap.appField)
          
          if (isMatch) {
            matchedFields++
          } else if (appValue && docValue) {
            // Determine severity based on field type and confidence
            let severity: "critical" | "warning" | "info"
            if (fieldMap.appField === "applicantName" && confidence > 80) {
              severity = "critical"
            } else if (fieldMap.appField === "applicantDob") {
              severity = "critical"
            } else if (fieldMap.appField === "applicantAddress" && confidence > 75) {
              severity = "warning"
            } else if (confidence > 70) {
              severity = "warning"
            } else {
              severity = "info"
            }

            discrepancies.push({
              id: `disc-${doc.id}-${docField}`,
              fieldName: docField,
              fieldLabel: fieldMap.appLabel,
              applicationValue: appValue,
              documentValue: docValue,
              documentSource: doc.fileName,
              documentType: formatDocumentCode(mapping.typeCode),
              severity,
              status: "open",
            })
          }
        }
      }
    }
  }

  // Calculate overall match percentage
  const overallMatch = totalFieldsChecked > 0 ? (matchedFields / totalFieldsChecked) * 100 : 100

  // Determine recommendation
  const criticalCount = discrepancies.filter((d) => d.severity === "critical").length
  const warningCount = discrepancies.filter((d) => d.severity === "warning").length

  let recommendation: "approved" | "needs_review" | "rejected"
  if (criticalCount > 0 || expiredDocuments.length > 0) {
    recommendation = "rejected"
  } else if (warningCount > 0 || overallMatch < 80) {
    recommendation = "needs_review"
  } else {
    recommendation = "approved"
  }

  return {
    applicationNumber: application.applicationNumber,
    totalFieldsChecked,
    matchedFields,
    discrepancies,
    expiredDocuments,
    overallMatch,
    recommendation,
  }
}

// Helper: Compare values with some tolerance
function compareValues(appValue: string | null, docValue: string, fieldType: string): boolean {
  if (!appValue) return false

  const normalizedApp = appValue.toLowerCase().trim()
  const normalizedDoc = docValue.toLowerCase().trim()

  // Exact match
  if (normalizedApp === normalizedDoc) return true

  // For names, check if key parts match (first/last name)
  if (fieldType === "applicantName") {
    const appParts = normalizedApp.split(/\s+/)
    const docParts = normalizedDoc.split(/\s+/)
    const matchingParts = appParts.filter((p) => docParts.includes(p))
    return matchingParts.length >= Math.min(2, appParts.length)
  }

  // For addresses, check if key parts match
  if (fieldType === "applicantAddress") {
    // Check if at least 60% of words match
    const appWords = normalizedApp.split(/[\s,]+/).filter((w) => w.length > 2)
    const docWords = normalizedDoc.split(/[\s,]+/).filter((w) => w.length > 2)
    const matchingWords = appWords.filter((w) => docWords.some((dw) => dw.includes(w) || w.includes(dw)))
    return matchingWords.length >= appWords.length * 0.6
  }

  // For dates, normalize format
  if (fieldType === "applicantDob") {
    const appDate = parseDate(normalizedApp)
    const docDate = parseDate(normalizedDoc)
    return appDate === docDate
  }

  return false
}

// Helper: Parse various date formats to YYYY-MM-DD
function parseDate(dateStr: string): string {
  // Try to parse common formats
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{2})-(\d{2})-(\d{4})$/, // MM-DD-YYYY
  ]

  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      if (format === formats[0]) return dateStr
      // Assume MM/DD/YYYY or similar
      return `${match[3]}-${match[1]}-${match[2]}`
    }
  }

  return dateStr
}

// Helper: Format document code to readable name
function formatDocumentCode(code: string): string {
  return code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// Generate Final Summary
export function generateFinalSummary(
  initialCheck: InitialCheckResult,
  validation: ValidationResult
): FinalSummary {
  const appType = applicationTypes.find((t) => t.code === initialCheck.applicationType)

  // Count issues by severity
  const criticalIssues = validation.discrepancies.filter((d) => d.severity === "critical" && d.status === "open").length
  const warningIssues = validation.discrepancies.filter((d) => d.severity === "warning" && d.status === "open").length
  const infoIssues = validation.discrepancies.filter((d) => d.severity === "info" && d.status === "open").length

  // Determine overall status
  let overallStatus: "approved" | "needs_review" | "rejected"
  let riskLevel: "low" | "medium" | "high"

  if (
    criticalIssues > 0 ||
    validation.expiredDocuments.length > 0 ||
    initialCheck.completenessScore < 60
  ) {
    overallStatus = "rejected"
    riskLevel = "high"
  } else if (
    warningIssues > 0 ||
    initialCheck.completenessScore < 100 ||
    validation.overallMatch < 90
  ) {
    overallStatus = "needs_review"
    riskLevel = "medium"
  } else {
    overallStatus = "approved"
    riskLevel = "low"
  }

  // Generate recommendation text
  let recommendation = ""
  if (overallStatus === "approved") {
    recommendation =
      "All required documents present and verified. Data matches application form. No discrepancies found. Application meets all regulatory requirements and is ready for approval."
  } else if (overallStatus === "needs_review") {
    const reasons = []
    if (initialCheck.missingCount > 0) reasons.push(`${initialCheck.missingCount} document(s) missing`)
    if (warningIssues > 0) reasons.push(`${warningIssues} data mismatch(es)`)
    if (validation.overallMatch < 90) reasons.push("low data match rate")
    recommendation = `Manual review required: ${reasons.join(", ")}. Verify with customer before proceeding.`
  } else {
    const reasons = []
    if (criticalIssues > 0) reasons.push(`${criticalIssues} critical discrepancy(ies)`)
    if (validation.expiredDocuments.length > 0)
      reasons.push(`${validation.expiredDocuments.length} expired document(s)`)
    if (initialCheck.completenessScore < 60) reasons.push("insufficient documentation")
    recommendation = `Application rejected: ${reasons.join(", ")}. Request updated documents and resubmit.`
  }

  return {
    applicationNumber: initialCheck.applicationNumber,
    applicationType: initialCheck.applicationType,
    applicationTypeName: initialCheck.applicationTypeName,
    completeness: {
      totalRequired: initialCheck.requiredDocuments.length,
      present: initialCheck.presentCount,
      missing: initialCheck.requiredDocuments.filter((d) => !d.isPresent).map((d) => d.name),
      score: initialCheck.completenessScore,
    },
    validation: {
      totalFieldsChecked: validation.totalFieldsChecked,
      matchedFields: validation.matchedFields,
      mismatchedFields: validation.totalFieldsChecked - validation.matchedFields,
      matchRate: validation.overallMatch,
    },
    issues: {
      critical: criticalIssues,
      warnings: warningIssues,
      info: infoIssues,
      total: criticalIssues + warningIssues + infoIssues,
    },
    expiredDocuments: validation.expiredDocuments.map((d) => ({
      documentName: d.documentName,
      documentType: d.documentType,
      expiryDate: d.expiryDate,
      daysExpired: d.daysExpired,
    })),
    overallStatus,
    riskLevel,
    recommendation,
  }
}
