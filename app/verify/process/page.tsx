"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
  Zap,
  Brain,
  ArrowRight,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  generateQualityScore,
  generateTamperingScore,
  generateQualityIssues,
  generateTamperingFlags,
  generateMockExtraction,
} from "@/lib/mock-data"
import { mapDocumentToType } from "@/lib/external-system-mock"
import type { ExternalApplication, ExternalDocument, ApplicationType } from "@/lib/types"

interface ProcessingStep {
  id: string
  label: string
  icon: React.ElementType
  status: "pending" | "processing" | "completed" | "failed"
}

interface DocumentResult {
  id: string
  fileName: string
  typeCode: string
  typeName: string
  qualityScore: number
  tamperingScore: number
  qualityIssues: string[]
  tamperingFlags: string[]
  extractedData: Record<string, { value: string; confidence: number }>
  status: "pending" | "processing" | "completed" | "failed"
  verificationResult: "verified" | "warning" | "failed" | null
}

function ProcessPageContent() {
  const searchParams = useSearchParams()
  const applicationNumber = searchParams.get("applicationNumber")

  const [overallProgress, setOverallProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [documentResults, setDocumentResults] = useState<DocumentResult[]>([])
  const [application, setApplication] = useState<ExternalApplication | null>(null)
  const [appType, setAppType] = useState<ApplicationType | null>(null)
  const [missingDocuments, setMissingDocuments] = useState<string[]>([])

  const steps: ProcessingStep[] = [
    { id: "fetch", label: "Fetching Documents", icon: FileText, status: "pending" },
    { id: "quality", label: "Quality Analysis", icon: Zap, status: "pending" },
    { id: "tampering", label: "Tampering Detection", icon: Shield, status: "pending" },
    { id: "extract", label: "Data Extraction", icon: Brain, status: "pending" },
    { id: "verify", label: "AI Verification", icon: CheckCircle, status: "pending" },
  ]

  const [processingSteps, setProcessingSteps] = useState(steps)

  useEffect(() => {
    if (!applicationNumber) return

    const storedData = sessionStorage.getItem(`verify-${applicationNumber}`)
    if (!storedData) return

    const data = JSON.parse(storedData)
    setApplication(data.application)
    setAppType(data.appType)
    setMissingDocuments(data.missingDocuments || [])

    const initialResults: DocumentResult[] = (data.documents || []).map((doc: ExternalDocument) => {
      const mapping = mapDocumentToType(doc)
      return {
        id: doc.id,
        fileName: doc.fileName,
        typeCode: mapping.typeCode,
        typeName: mapping.typeCode.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        qualityScore: 0,
        tamperingScore: 0,
        qualityIssues: [],
        tamperingFlags: [],
        extractedData: {},
        status: "pending",
        verificationResult: null,
      }
    })
    setDocumentResults(initialResults)

    simulateProcessing(initialResults, data.application?.applicantName || "Applicant")
  }, [applicationNumber])

  const simulateProcessing = async (docs: DocumentResult[], applicantName: string) => {
    const totalSteps = 5
    const stepDuration = 1200

    for (let step = 0; step < totalSteps; step++) {
      setProcessingSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i < step ? "completed" : i === step ? "processing" : "pending",
        })),
      )

      await new Promise((resolve) => setTimeout(resolve, stepDuration))

      if (step === 0) {
        setDocumentResults((prev) => prev.map((d) => ({ ...d, status: "processing" })))
      } else if (step === 1) {
        setDocumentResults((prev) =>
          prev.map((d) => {
            const qualityScore = generateQualityScore()
            return { ...d, qualityScore, qualityIssues: generateQualityIssues(qualityScore) }
          }),
        )
      } else if (step === 2) {
        setDocumentResults((prev) =>
          prev.map((d) => {
            const tamperingScore = generateTamperingScore()
            return { ...d, tamperingScore, tamperingFlags: generateTamperingFlags(tamperingScore) }
          }),
        )
      } else if (step === 3) {
        setDocumentResults((prev) =>
          prev.map((d) => ({ ...d, extractedData: generateMockExtraction(d.typeCode, applicantName) })),
        )
      } else if (step === 4) {
        setDocumentResults((prev) =>
          prev.map((d) => {
            let verificationResult: "verified" | "warning" | "failed"
            if (d.qualityScore >= 80 && d.tamperingScore >= 90) {
              verificationResult = "verified"
            } else if (d.qualityScore >= 70 && d.tamperingScore >= 85) {
              verificationResult = "warning"
            } else {
              verificationResult = "failed"
            }
            return { ...d, status: "completed", verificationResult }
          }),
        )
      }

      setOverallProgress(((step + 1) / totalSteps) * 100)
    }

    setProcessingSteps((prev) => prev.map((s) => ({ ...s, status: "completed" })))
    setIsComplete(true)
  }

  const verifiedCount = documentResults.filter((d) => d.verificationResult === "verified").length
  const warningCount = documentResults.filter((d) => d.verificationResult === "warning").length
  const failedCount = documentResults.filter((d) => d.verificationResult === "failed").length

  const overallStatus =
    failedCount > 0 || missingDocuments.length > 0
      ? "needs_review"
      : warningCount > 0
        ? "review_recommended"
        : "verified"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">DocIntel Agent</span>
          </Link>
          <Link href={`/verify?applicationNumber=${applicationNumber}`}>
            <Button variant="ghost" size="sm">
              Back to Details
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Document Processing</CardTitle>
                <CardDescription className="font-mono">{applicationNumber}</CardDescription>
              </div>
              {isComplete && (
                <Badge
                  className={cn(
                    "text-sm",
                    overallStatus === "verified" && "bg-success/20 text-success",
                    overallStatus === "review_recommended" && "bg-warning/20 text-warning",
                    overallStatus === "needs_review" && "bg-destructive/20 text-destructive",
                  )}
                >
                  {overallStatus === "verified" && "All Verified"}
                  {overallStatus === "review_recommended" && "Review Recommended"}
                  {overallStatus === "needs_review" && "Needs Review"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div className="flex items-center justify-between gap-2">
              {processingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        step.status === "completed" && "bg-success text-success-foreground",
                        step.status === "processing" && "bg-primary text-primary-foreground",
                        step.status === "pending" && "bg-muted text-muted-foreground",
                        step.status === "failed" && "bg-destructive text-destructive-foreground",
                      )}
                    >
                      {step.status === "processing" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : step.status === "completed" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-center text-xs">{step.label}</span>
                  </div>
                  {index < processingSteps.length - 1 && (
                    <div
                      className={cn("mx-2 h-0.5 flex-1", step.status === "completed" ? "bg-success" : "bg-border")}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {missingDocuments.length > 0 && (
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-warning">
                <AlertTriangle className="h-5 w-5" />
                Missing Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {missingDocuments.map((code) => (
                  <Badge key={code} variant="outline" className="border-warning text-warning">
                    {code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isComplete && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            <Card className="border-success/30 bg-success/5">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-2xl font-bold text-success">{verifiedCount}</p>
                  <p className="text-xs text-muted-foreground">Verified</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </CardContent>
            </Card>
            <Card className="border-warning/30 bg-warning/5">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-2xl font-bold text-warning">{warningCount}</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </CardContent>
            </Card>
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-2xl font-bold text-destructive">{failedCount}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Document Analysis Results</h2>

          {documentResults.map((doc) => (
            <Card key={doc.id} className="border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-4 w-4 text-primary" />
                      {doc.typeName}
                    </CardTitle>
                    <CardDescription>{doc.fileName}</CardDescription>
                  </div>
                  {doc.status === "completed" && (
                    <Badge
                      className={cn(
                        doc.verificationResult === "verified" && "bg-success/20 text-success",
                        doc.verificationResult === "warning" && "bg-warning/20 text-warning",
                        doc.verificationResult === "failed" && "bg-destructive/20 text-destructive",
                      )}
                    >
                      {doc.verificationResult === "verified" && "Verified"}
                      {doc.verificationResult === "warning" && "Review Needed"}
                      {doc.verificationResult === "failed" && "Failed"}
                    </Badge>
                  )}
                  {doc.status === "processing" && (
                    <Badge className="bg-primary/20 text-primary">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Processing
                    </Badge>
                  )}
                  {doc.status === "pending" && (
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {doc.qualityScore > 0 && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-warning" />
                            Quality Score
                          </span>
                          <span className={cn("font-medium", doc.qualityScore >= 80 ? "text-success" : "text-warning")}>
                            {doc.qualityScore.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={doc.qualityScore}
                          className={cn("h-2", doc.qualityScore >= 80 ? "[&>div]:bg-success" : "[&>div]:bg-warning")}
                        />
                        {doc.qualityIssues.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {doc.qualityIssues.map((issue, i) => (
                              <p key={i} className="flex items-center gap-2 text-xs text-warning">
                                <AlertTriangle className="h-3 w-3" />
                                {issue}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-success" />
                            Authenticity Score
                          </span>
                          <span
                            className={cn("font-medium", doc.tamperingScore >= 90 ? "text-success" : "text-warning")}
                          >
                            {doc.tamperingScore.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={doc.tamperingScore}
                          className={cn("h-2", doc.tamperingScore >= 90 ? "[&>div]:bg-success" : "[&>div]:bg-warning")}
                        />
                        {doc.tamperingFlags.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {doc.tamperingFlags.map((flag, i) => (
                              <p key={i} className="flex items-center gap-2 text-xs text-warning">
                                <AlertTriangle className="h-3 w-3" />
                                {flag}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
                        <Brain className="h-4 w-4 text-primary" />
                        Extracted Data
                      </h4>
                      <div className="space-y-2 rounded-lg bg-muted p-3">
                        {Object.entries(doc.extractedData).map(([key, data]) => (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{data.value}</span>
                              <Badge variant="outline" className="text-xs">
                                {data.confidence.toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {doc.status === "processing" && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Processing document...</span>
                  </div>
                )}
                {doc.status === "pending" && (
                  <div className="flex items-center justify-center py-8">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Waiting to process...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {isComplete && (
          <Card className="mt-8 border-border bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {overallStatus === "verified"
                      ? "All documents verified successfully!"
                      : overallStatus === "review_recommended"
                        ? "Verification complete with some warnings"
                        : "Some documents require manual review"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {overallStatus === "verified"
                      ? "The application can proceed to the next stage."
                      : "Please review flagged documents before final approval."}
                  </p>
                </div>
                <Link href="/">
                  <Button>
                    Return Home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default function ProcessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ProcessPageContent />
    </Suspense>
  )
}
