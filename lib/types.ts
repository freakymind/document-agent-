export interface Institution {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DocumentType {
  id: string
  institution_id: string
  name: string
  code: string
  category: "identity" | "financial" | "business"
  description: string | null
  is_required: boolean
  max_file_size_mb: number
  allowed_formats: string[]
  is_active: boolean
  created_at: string
}

export interface FieldConfig {
  id: string
  document_type_id: string
  field_name: string
  field_label: string
  field_type: "text" | "date" | "number" | "boolean"
  is_required: boolean
  validation_regex: string | null
  created_at: string
}

export interface Application {
  id: string
  institution_id: string
  applicant_name: string
  applicant_email: string
  applicant_phone: string | null
  applicant_dob: string | null
  applicant_address: string | null
  status: "pending" | "documents_uploaded" | "processing" | "verified" | "rejected"
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  application_id: string
  document_type_id: string
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  status:
    | "uploaded"
    | "processing"
    | "quality_check"
    | "tampering_check"
    | "extracting"
    | "verifying"
    | "completed"
    | "failed"
  quality_score: number | null
  tampering_score: number | null
  quality_issues: string[]
  tampering_flags: string[]
  created_at: string
  updated_at: string
  document_type?: DocumentType
}

export interface ExtractionResult {
  id: string
  document_id: string
  field_name: string
  extracted_value: string | null
  confidence_score: number | null
  is_verified: boolean
  verification_notes: string | null
  created_at: string
}

export interface ProcessingLog {
  id: string
  document_id: string
  step: string
  status: "started" | "completed" | "failed"
  message: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface DocumentWithType extends Document {
  document_type: DocumentType
}

export interface ApplicationWithDocuments extends Application {
  documents: DocumentWithType[]
  institution: Institution
}

export interface ApplicationType {
  id: string
  code: string
  name: string
  description: string
  requiredDocuments: string[] // document type codes
}

export interface ExternalApplication {
  applicationNumber: string
  applicationType: string // code like "personal_account", "business_account"
  applicantName: string
  applicantEmail: string
  applicantPhone: string | null
  applicantDob: string | null
  applicantAddress: string | null
  submittedAt: string
  status: "pending_verification" | "in_review" | "approved" | "rejected"
}

export interface ExternalDocument {
  id: string
  applicationNumber: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  metadata: {
    documentCategory?: string // from external system: "identity", "financial", etc.
    documentLabel?: string // e.g., "Passport", "Bank Statement"
    sourceSystem?: string
  }
}

export interface DocumentMapping {
  externalDocument: ExternalDocument
  matchedDocumentType: DocumentType | null
  confidence: number
  matchReason: string
}
