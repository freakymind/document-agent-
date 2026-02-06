"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Shield,
  Brain,
  XCircle,
  Bot,
  ClipboardCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  FileWarning,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  fetchApplication,
  fetchApplicationDocuments,
  mapDocumentToType,
} from "@/lib/external-system-mock"
import { runInitialCheckAgent, runValidationAgent, generateFinalSummary } from "@/lib/agents"
import { FinalSummaryCard } from "@/components/final-summary"
import {
  generateQualityScore,
  generateTamperingScore,
  generateQualityIssues,
  generateTamperingFlags,
  generateMockExtraction,
} from "@/lib/mock-data"
import type {
  ExternalApplication,
  ExternalDocument,
  InitialCheckResult,
  ValidationResult,
  FieldDiscrepancy,
  AgentStep,
  FinalSummary,
} from "@/lib/types"

interface DocumentProcessingResult {
  id: string
  fileName: string
  typeCode: string
  typeName: string
  qualityScore: number
  tamperingScore: number
  qualityIssues: string[]
  tamperingFlags: string[]
  extractedData: Record<string, { value: string; confidence: number }>
}

function AgentVerificationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const applicationNumber = searchParams.get("applicationNumber")

  // State
  const [application, setApplication] = useState<ExternalApplication | null>(null)
  const [documents, setDocuments] = useState<ExternalDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Agent states
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([
    { id: "fetch", name: "Fetching Application Data", status: "pending" },
    { id: "initial_check", name: "Initial Check Agent", status: "pending" },
    { id: "document_processing", name: "Document Processing", status: "pending" },
    { id: "validation", name: "Validation Agent", status: "pending" },
    { id: "report", name: "Generating Report", status: "pending" },
  ])

  // Agent results
  const [initialCheckResult, setInitialCheckResult] = useState<InitialCheckResult | null>(null)
  const [documentResults, setDocumentResults] = useState<DocumentProcessingResult[]>([])
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [discrepancies, setDiscrepancies] = useState<FieldDiscrepancy[]>([])
  const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null)

  // UI state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    initial_check: true,
    documents: true,
    validation: true,
    report: true,
    summary: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Update agent step status
  const updateStepStatus = (stepId: string, status: AgentStep["status"], message?: string) => {
    setAgentSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, status, message, timestamp: new Date().toISOString() }
          : step
      )
    )
  }

  // Run the agent pipeline
  useEffect(() => {
    if (!applicationNumber) {
      setError("No application number provided")
      setIsLoading(false)
      return
    }

    runAgentPipeline()
  }, [applicationNumber])

  const runAgentPipeline = async () => {
    if (!applicationNumber) return

    try {
      // Step 1: Fetch application data
      updateStepStatus("fetch", "running")
      const appData = await fetchApplication(applicationNumber)
      if (!appData) {
        updateStepStatus("fetch", "error", "Application not found")
        setError(`Application not found: ${applicationNumber}`)
        setIsLoading(false)
        return
      }
      setApplication(appData)
      const docs = await fetchApplicationDocuments(applicationNumber)
      setDocuments(docs)
      updateStepStatus("fetch", "completed", `Found ${docs.length} documents`)

      // Step 2: Run Initial Check Agent
      updateStepStatus("initial_check", "running")
      await new Promise((r) => setTimeout(r, 500)) // Small delay for visual effect
      const initialResult = await runInitialCheckAgent(appData, docs)
      setInitialCheckResult(initialResult)
      updateStepStatus(
        "initial_check",
        "completed",
        `${initialResult.presentCount}/${initialResult.requiredDocuments.length} documents present`
      )

      // Step 3: Process each document
      updateStepStatus("document_processing", "running")
      const processedDocs: DocumentProcessingResult[] = []
      
      for (const doc of docs) {
        await new Promise((r) => setTimeout(r, 800)) // Simulate processing time
        const mapping = mapDocumentToType(doc)
        const qualityScore = generateQualityScore()
        const tamperingScore = generateTamperingScore()
        
        processedDocs.push({
          id: doc.id,
          fileName: doc.fileName,
          typeCode: mapping.typeCode,
          typeName: mapping.typeCode.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          qualityScore,
          tamperingScore,
          qualityIssues: generateQualityIssues(qualityScore),
          tamperingFlags: generateTamperingFlags(tamperingScore),
          extractedData: generateMockExtraction(mapping.typeCode, appData.applicantName),
        })
        setDocumentResults([...processedDocs])
      }
      updateStepStatus("document_processing", "completed", `Processed ${docs.length} documents`)

      // Step 4: Run Validation Agent
      updateStepStatus("validation", "running")
      const extractedDataByDoc: Record<string, Record<string, { value: string; confidence: number }>> = {}
      for (const pd of processedDocs) {
        extractedDataByDoc[pd.id] = pd.extractedData
      }
      const valResult = await runValidationAgent(appData, docs, extractedDataByDoc)
      setValidationResult(valResult)
      setDiscrepancies(valResult.discrepancies)
      updateStepStatus(
        "validation",
        "completed",
        `${valResult.discrepancies.length} discrepancies found`
      )

      // Step 5: Generate Final Summary Report
      updateStepStatus("report", "running")
      await new Promise((r) => setTimeout(r, 1000))
      
      // Generate comprehensive summary
      const summary = generateFinalSummary(initialResult, valResult)
      setFinalSummary(summary)
      
      updateStepStatus("report", "completed", "Final summary generated")

      setIsLoading(false)
    } catch (err) {
      setError("An error occurred during processing")
      setIsLoading(false)
    }
  }

  // Handle discrepancy resolution
  const resolveDiscrepancy = (discId: string, resolution: "resolved" | "ignored") => {
    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === discId
          ? {
              ...d,
              status: resolution,
              resolution: resolution === "resolved" ? "Manually verified" : "Marked as not applicable",
              resolvedAt: new Date().toISOString(),
            }
          : d
      )
    )
  }

  const currentStep = agentSteps.find((s) => s.status === "running")
  const completedSteps = agentSteps.filter((s) => s.status === "completed").length
  const progress = (completedSteps / agentSteps.length) * 100

  const openDiscrepancies = discrepancies.filter((d) => d.status === "open")
  const resolvedDiscrepancies = discrepancies.filter((d) => d.status !== "open")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">DocIntel Agent</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {applicationNumber}
            </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-4 pt-6">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Error</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" onClick={() => router.push("/verify")} className="ml-auto">
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Agent Pipeline Progress */}
            <Card className="mb-6 border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    AI Agent Pipeline
                  </CardTitle>
                  {!isLoading && (
                    <Badge className="bg-success/20 text-success">Complete</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {currentStep ? currentStep.name : "Processing complete"}
                    </span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {agentSteps.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "flex flex-col items-center rounded-lg border p-3 text-center",
                        step.status === "completed" && "border-success/50 bg-success/5",
                        step.status === "running" && "border-primary/50 bg-primary/5",
                        step.status === "error" && "border-destructive/50 bg-destructive/5",
                        step.status === "pending" && "border-border bg-muted/30"
                      )}
                    >
                      {step.status === "completed" && <CheckCircle className="mb-1 h-5 w-5 text-success" />}
                      {step.status === "running" && <Loader2 className="mb-1 h-5 w-5 animate-spin text-primary" />}
                      {step.status === "error" && <XCircle className="mb-1 h-5 w-5 text-destructive" />}
                      {step.status === "pending" && <div className="mb-1 h-5 w-5 rounded-full border-2 border-muted-foreground/30" />}
                      <span className="text-xs font-medium">{step.name}</span>
                      {step.message && (
                        <span className="mt-1 text-xs text-muted-foreground">{step.message}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Initial Check Agent Results */}
            {initialCheckResult && (
              <Card className="mb-6 border-border bg-card overflow-hidden">
                <CardHeader
                  className="cursor-pointer border-b border-border"
                  onClick={() => toggleSection("initial_check")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Document Completeness Check</CardTitle>
                        <CardDescription>Verifying required documents for this application type</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          initialCheckResult.recommendation === "proceed" && "bg-success/20 text-success",
                          initialCheckResult.recommendation === "missing_documents" && "bg-warning/20 text-warning",
                          initialCheckResult.recommendation === "error" && "bg-destructive/20 text-destructive"
                        )}
                      >
                        {initialCheckResult.completenessScore.toFixed(0)}% Complete
                      </Badge>
                      {expandedSections.initial_check ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedSections.initial_check && (
                  <CardContent className="p-0">
                    {/* Application Type Header */}
                    <div className="bg-primary/5 border-b border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Application Type</p>
                          <p className="text-lg font-semibold">{initialCheckResult.applicationTypeName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Document Status</p>
                          <p className="text-lg font-semibold">
                            <span className="text-success">{initialCheckResult.presentCount}</span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span>{initialCheckResult.requiredDocuments.length}</span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={initialCheckResult.completenessScore} className="h-2" />
                      </div>
                    </div>

                    {/* Why These Documents Section */}
                    <div className="border-b border-border p-4 bg-muted/30">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <AlertCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm mb-1">Why are these documents required?</p>
                          <p className="text-sm text-muted-foreground">
                            {initialCheckResult.applicationType === "sme_current_account" && 
                              "SME current account opening requires Companies House incorporation documents, director identification under UK Money Laundering Regulations 2017, proof of business address, and 6 months trading history for FCA compliance."}
                            {initialCheckResult.applicationType === "corporate_current_account" && 
                              "Corporate accounts require enhanced due diligence under UK AML regulations including annual accounts, UBO declaration (25%+ shareholders), board resolution authorising account opening, and 12 months bank statements."}
                            {initialCheckResult.applicationType === "institutional_account" && 
                              "Institutional clients require FCA registration verification, audited financials, comprehensive KYC questionnaire, AML policy documentation, LEI registration, and board resolution per MiFID II and UK regulatory requirements."}
                            {initialCheckResult.applicationType === "trade_finance" && 
                              "Trade finance facilities require audited accounts, supplier contracts, trade references, sanctions screening under OFSI regulations, and enhanced financial due diligence for import/export activities."}
                            {initialCheckResult.applicationType === "pep_corporate" && 
                              "PEP-connected corporates require Enhanced Due Diligence (EDD) including source of wealth/funds documentation, PEP declaration, adverse media screening, and senior management sign-off per JMLSG guidance."}
                            {initialCheckResult.applicationType === "offshore_entity" && 
                              "Non-UK entities require Certificate of Good Standing, tax residency certificate, legal opinion on entity structure, enhanced source of wealth documentation, and comprehensive sanctions screening."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        {initialCheckResult.requiredDocuments.map((doc, index) => (
                          <div
                            key={doc.code}
                            className={cn(
                              "relative rounded-lg border-2 p-4 transition-all",
                              doc.isPresent 
                                ? "border-success/40 bg-success/5" 
                                : "border-destructive/40 bg-destructive/5"
                            )}
                          >
                            {/* Status Icon */}
                            <div className={cn(
                              "absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full",
                              doc.isPresent ? "bg-success" : "bg-destructive"
                            )}>
                              {doc.isPresent ? (
                                <Check className="h-3.5 w-3.5 text-success-foreground" />
                              ) : (
                                <X className="h-3.5 w-3.5 text-destructive-foreground" />
                              )}
                            </div>

                            {/* Document Info */}
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                doc.isPresent ? "bg-success/20" : "bg-destructive/20"
                              )}>
                                <FileText className={cn(
                                  "h-5 w-5",
                                  doc.isPresent ? "text-success" : "text-destructive"
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {doc.code === "certificate_of_incorporation" && "Companies House certificate confirming legal entity registration"}
                                  {doc.code === "memorandum_articles" && "M&A defining company structure, powers and shareholder rights"}
                                  {doc.code === "director_id" && "Passport or UK driving licence for all directors/partners"}
                                  {doc.code === "proof_of_address_business" && "Business rates bill, utility bill or lease agreement (< 3 months)"}
                                  {doc.code === "bank_statements_6m" && "6 months bank statements showing trading history"}
                                  {doc.code === "bank_statements_12m" && "12 months bank statements for enhanced due diligence"}
                                  {doc.code === "annual_accounts" && "Latest filed accounts from Companies House"}
                                  {doc.code === "audited_financials" && "Independently audited financial statements"}
                                  {doc.code === "ubo_declaration" && "Declaration of Ultimate Beneficial Owners (25%+ shareholding)"}
                                  {doc.code === "board_resolution" && "Board minutes authorising account opening and signatories"}
                                  {doc.code === "fca_registration" && "FCA registration certificate and permissions"}
                                  {doc.code === "kyc_questionnaire" && "Completed institutional KYC/CDD questionnaire"}
                                  {doc.code === "aml_policy" && "Organisation's AML/CFT policies and procedures"}
                                  {doc.code === "legal_entity_identifier" && "LEI registration for regulatory reporting (MiFID II)"}
                                  {doc.code === "trade_references" && "References from existing trade partners/suppliers"}
                                  {doc.code === "supplier_contracts" && "Sample supplier/buyer contracts for trade facilities"}
                                  {doc.code === "sanctions_screening" && "OFSI/OFAC sanctions screening results"}
                                  {doc.code === "pep_declaration" && "Declaration of PEP status for directors/UBOs"}
                                  {doc.code === "source_of_wealth" && "Documentation evidencing origin of wealth"}
                                  {doc.code === "source_of_funds" && "Evidence of funding source for account"}
                                  {doc.code === "enhanced_due_diligence" && "Completed EDD questionnaire and supporting docs"}
                                  {doc.code === "adverse_media_report" && "Third-party adverse media screening report"}
                                  {doc.code === "certificate_of_good_standing" && "Jurisdiction certificate confirming active status"}
                                  {doc.code === "tax_residency_certificate" && "Certificate of tax residency from home jurisdiction"}
                                  {doc.code === "legal_opinion" && "Legal opinion on entity structure and signatory authority"}
                                </p>
                              </div>
                            </div>

                            {/* Match Details */}
                            {doc.isPresent && doc.matchedDocument ? (
                              <div className="mt-3 rounded-md bg-background/80 p-2.5 border border-success/20">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                    <span className="text-xs font-medium truncate">{doc.matchedDocument.fileName}</span>
                                  </div>
                                  {doc.confidence && (
                                    <Badge variant="secondary" className="ml-2 shrink-0 text-xs bg-success/10 text-success border-0">
                                      {doc.confidence}% match
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 rounded-md bg-background/80 p-2.5 border border-destructive/20">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                                  <span className="text-xs text-destructive font-medium">Document not found in uploaded files</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Footer */}
                    <div className={cn(
                      "p-4 border-t border-border",
                      initialCheckResult.recommendation === "proceed" && "bg-success/10",
                      initialCheckResult.recommendation === "missing_documents" && "bg-warning/10",
                      initialCheckResult.recommendation === "error" && "bg-destructive/10"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {initialCheckResult.recommendation === "proceed" ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : initialCheckResult.recommendation === "missing_documents" ? (
                            <AlertTriangle className="h-5 w-5 text-warning" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                          <div>
                            <p className="font-semibold text-sm">
                              {initialCheckResult.recommendation === "proceed" && "All required documents found"}
                              {initialCheckResult.recommendation === "missing_documents" && `${initialCheckResult.missingCount} document(s) missing`}
                              {initialCheckResult.recommendation === "error" && "Critical documents missing"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {initialCheckResult.recommendation === "proceed" && "Ready to proceed with document verification"}
                              {initialCheckResult.recommendation === "missing_documents" && "Processing will continue with available documents"}
                              {initialCheckResult.recommendation === "error" && "Cannot proceed without required documents"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            initialCheckResult.recommendation === "proceed" && "bg-success text-success-foreground",
                            initialCheckResult.recommendation === "missing_documents" && "bg-warning text-warning-foreground",
                            initialCheckResult.recommendation === "error" && "bg-destructive text-destructive-foreground"
                          )}
                        >
                          {initialCheckResult.recommendation === "proceed" && "Ready"}
                          {initialCheckResult.recommendation === "missing_documents" && "Partial"}
                          {initialCheckResult.recommendation === "error" && "Blocked"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Document Processing Results */}
            {documentResults.length > 0 && (
              <Card className="mb-6 border-border bg-card">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleSection("documents")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Document Processing</CardTitle>
                        <CardDescription>Quality, tampering, and data extraction</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{documentResults.length} documents</Badge>
                      {expandedSections.documents ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedSections.documents && (
                  <CardContent className="space-y-4">
                    {documentResults.map((doc) => (
                      <div key={doc.id} className="rounded-lg border border-border bg-muted/30 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{doc.typeName}</p>
                            <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                          </div>
                          <Badge
                            className={cn(
                              doc.qualityScore >= 80 && doc.tamperingScore >= 90
                                ? "bg-success/20 text-success"
                                : doc.qualityScore >= 70 && doc.tamperingScore >= 85
                                  ? "bg-warning/20 text-warning"
                                  : "bg-destructive/20 text-destructive"
                            )}
                          >
                            {doc.qualityScore >= 80 && doc.tamperingScore >= 90
                              ? "Verified"
                              : doc.qualityScore >= 70 && doc.tamperingScore >= 85
                                ? "Warning"
                                : "Failed"}
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Quality</span>
                              <span className={doc.qualityScore >= 80 ? "text-success" : "text-warning"}>
                                {doc.qualityScore.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={doc.qualityScore} className="h-1.5" />
                            {doc.qualityIssues.length > 0 && (
                              <div className="mt-2">
                                {doc.qualityIssues.map((issue, idx) => (
                                  <p key={idx} className="text-xs text-warning">• {issue}</p>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Authenticity</span>
                              <span className={doc.tamperingScore >= 90 ? "text-success" : "text-warning"}>
                                {doc.tamperingScore.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={doc.tamperingScore} className="h-1.5" />
                            {doc.tamperingFlags.length > 0 && (
                              <div className="mt-2">
                                {doc.tamperingFlags.map((flag, idx) => (
                                  <p key={idx} className="text-xs text-destructive">⚠ {flag}</p>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Fields Extracted</span>
                              <span>{Object.keys(doc.extractedData).length}</span>
                            </div>
                            <Progress value={100} className="h-1.5" />
                          </div>
                        </div>

                        {/* Extracted Data */}
                        <div className="mt-4 rounded-md border border-border bg-background p-3">
                          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Extracted Data
                          </h5>
                          <div className="grid gap-2 md:grid-cols-2">
                            {Object.entries(doc.extractedData).map(([key, data]) => (
                              <div key={key} className="flex items-start justify-between rounded border border-border bg-muted/30 p-2">
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-muted-foreground">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                  </p>
                                  <p className="mt-0.5 font-mono text-sm">{data.value}</p>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "ml-2 text-xs",
                                    data.confidence >= 90 ? "border-success/50 text-success" : 
                                    data.confidence >= 80 ? "border-warning/50 text-warning" : 
                                    "border-destructive/50 text-destructive"
                                  )}
                                >
                                  {data.confidence.toFixed(0)}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Validation Agent Results */}
            {validationResult && (
              <Card className="mb-6 border-border bg-card">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleSection("validation")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Validation Agent</CardTitle>
                        <CardDescription>Cross-reference with application data</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          validationResult.recommendation === "approved" && "bg-success/20 text-success",
                          validationResult.recommendation === "needs_review" && "bg-warning/20 text-warning",
                          validationResult.recommendation === "rejected" && "bg-destructive/20 text-destructive"
                        )}
                      >
                        {validationResult.overallMatch.toFixed(0)}% Match
                      </Badge>
                      {expandedSections.validation ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedSections.validation && (
                  <CardContent>
                    <div className="mb-4 grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-muted/50 p-3 text-center">
                        <p className="text-2xl font-bold">{validationResult.totalFieldsChecked}</p>
                        <p className="text-xs text-muted-foreground">Fields Checked</p>
                      </div>
                      <div className="rounded-lg bg-success/10 p-3 text-center">
                        <p className="text-2xl font-bold text-success">{validationResult.matchedFields}</p>
                        <p className="text-xs text-muted-foreground">Matched</p>
                      </div>
                      <div className="rounded-lg bg-warning/10 p-3 text-center">
                        <p className="text-2xl font-bold text-warning">{validationResult.discrepancies.length}</p>
                        <p className="text-xs text-muted-foreground">Discrepancies</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <p className="mb-1 text-sm font-medium">Recommendation</p>
                      <p
                        className={cn(
                          "text-sm",
                          validationResult.recommendation === "approved" && "text-success",
                          validationResult.recommendation === "needs_review" && "text-warning",
                          validationResult.recommendation === "rejected" && "text-destructive"
                        )}
                      >
                        {validationResult.recommendation === "approved" &&
                          "All extracted data matches application information. Ready for approval."}
                        {validationResult.recommendation === "needs_review" &&
                          "Some discrepancies found. Manual review recommended before proceeding."}
                        {validationResult.recommendation === "rejected" &&
                          "Critical discrepancies detected. Application requires investigation."}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Discrepancy Report */}
            {!isLoading && discrepancies.length > 0 && (
              <Card className="mb-6 border-border bg-card">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleSection("report")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Discrepancy Report</CardTitle>
                        <CardDescription>Review and resolve data mismatches</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {openDiscrepancies.length} open / {resolvedDiscrepancies.length} resolved
                      </Badge>
                      {expandedSections.report ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedSections.report && (
                  <CardContent className="space-y-3">
                    {discrepancies.map((disc) => (
                      <div
                        key={disc.id}
                        className={cn(
                          "rounded-lg border p-4",
                          disc.status === "open" && disc.severity === "critical" && "border-destructive/50 bg-destructive/5",
                          disc.status === "open" && disc.severity === "warning" && "border-warning/50 bg-warning/5",
                          disc.status === "open" && disc.severity === "info" && "border-blue-500/50 bg-blue-500/5",
                          disc.status !== "open" && "border-border bg-muted/30 opacity-60"
                        )}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                disc.severity === "critical" && "border-destructive text-destructive",
                                disc.severity === "warning" && "border-warning text-warning",
                                disc.severity === "info" && "border-blue-500 text-blue-500"
                              )}
                            >
                              {disc.severity}
                            </Badge>
                            <span className="font-medium">{disc.fieldLabel}</span>
                          </div>
                          {disc.status === "open" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 gap-1 text-xs bg-transparent"
                                onClick={() => resolveDiscrepancy(disc.id, "resolved")}
                              >
                                <Check className="h-3 w-3" />
                                Resolve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 gap-1 text-xs"
                                onClick={() => resolveDiscrepancy(disc.id, "ignored")}
                              >
                                <X className="h-3 w-3" />
                                Ignore
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              {disc.status === "resolved" ? "Resolved" : "Ignored"}
                            </Badge>
                          )}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded bg-background p-2">
                            <p className="mb-1 text-xs text-muted-foreground">Application Value</p>
                            <p className="font-mono text-sm">{disc.applicationValue || "—"}</p>
                          </div>
                          <div className="rounded bg-background p-2">
                            <p className="mb-1 text-xs text-muted-foreground">Document Value</p>
                            <p className="font-mono text-sm">{disc.documentValue || "—"}</p>
                          </div>
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Source: {disc.documentType} ({disc.documentSource})
                        </p>
                      </div>
                    ))}

                    {openDiscrepancies.length === 0 && discrepancies.length > 0 && (
                      <div className="rounded-lg bg-success/10 p-4 text-center">
                        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-success" />
                        <p className="font-medium text-success">All discrepancies resolved!</p>
                        <p className="text-sm text-muted-foreground">The application is ready for final approval.</p>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Final Actions */}
            {!isLoading && finalSummary && (
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Processing Complete</h3>
                      <p className="text-sm text-muted-foreground">
                        {openDiscrepancies.length > 0
                          ? `${openDiscrepancies.length} discrepancy(ies) need resolution`
                          : "All checks passed. Ready to view final summary."}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => router.push("/verify")}>
                        New Verification
                      </Button>
                      <Button
                        onClick={() => {
                          // Store summary data in sessionStorage for the summary page
                          sessionStorage.setItem(
                            `summary-${applicationNumber}`,
                            JSON.stringify({
                              summary: finalSummary,
                              application,
                              documents,
                              validationResult,
                            })
                          )
                          router.push(`/verify/summary?applicationNumber=${applicationNumber}`)
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        View Final Summary
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function AgentVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AgentVerificationContent />
    </Suspense>
  )
}
