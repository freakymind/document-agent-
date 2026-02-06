"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  FileCheck,
  Search,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  Calendar,
  Mail,
  MapPin,
  Building2,
} from "lucide-react"
import Link from "next/link"
import {
  fetchApplication,
  fetchApplicationDocuments,
  getApplicationType,
  mapDocumentToType,
  getSampleApplicationNumbers,
} from "@/lib/external-system-mock"
import type { ExternalApplication, ExternalDocument, ApplicationType, DocumentMapping } from "@/lib/types"
import { cn } from "@/lib/utils"

function VerifyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialAppNum = searchParams.get("applicationNumber")

  const [applicationNumber, setApplicationNumber] = useState(initialAppNum || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false)

  const [application, setApplication] = useState<ExternalApplication | null>(null)
  const [documents, setDocuments] = useState<ExternalDocument[]>([])
  const [appType, setAppType] = useState<ApplicationType | null>(null)
  const [documentMappings, setDocumentMappings] = useState<DocumentMapping[]>([])
  const [missingDocuments, setMissingDocuments] = useState<string[]>([])

  const sampleApplications = getSampleApplicationNumbers()

  // Auto-fetch if application number is in URL (only once on mount)
  useEffect(() => {
    if (initialAppNum && !hasFetchedInitial) {
      setHasFetchedInitial(true)
      handleFetchApplication(initialAppNum)
    }
  }, [initialAppNum, hasFetchedInitial])

  const handleFetchApplication = async (appNum?: string) => {
    const numToFetch = appNum || applicationNumber
    if (!numToFetch.trim()) {
      setError("Please enter an application number")
      return
    }

    setIsLoading(true)
    setError(null)
    setApplication(null)
    setDocuments([])
    setAppType(null)
    setDocumentMappings([])
    setMissingDocuments([])

    try {
      // Fetch application details
      const appData = await fetchApplication(numToFetch)
      if (!appData) {
        setError(`Application not found: ${numToFetch}`)
        setIsLoading(false)
        return
      }
      setApplication(appData)

      // Get application type configuration
      const typeConfig = getApplicationType(appData.applicationType)
      setAppType(typeConfig || null)

      // Fetch documents from external system
      const docs = await fetchApplicationDocuments(numToFetch)
      setDocuments(docs)

      // Map documents to configured types
      const mappings: DocumentMapping[] = docs.map((doc) => {
        const mapping = mapDocumentToType(doc)
        return {
          externalDocument: doc,
          matchedDocumentType: null, // In real app, would match to DB config
          confidence: mapping.confidence,
          matchReason: mapping.reason,
        }
      })
      setDocumentMappings(mappings)

      // Check for missing required documents
      if (typeConfig) {
        const uploadedTypeCodes = docs.map((d) => mapDocumentToType(d).typeCode)
        const missing = typeConfig.requiredDocuments.filter((reqCode) => !uploadedTypeCodes.includes(reqCode))
        setMissingDocuments(missing)
      }
    } catch (err) {
      setError("Failed to fetch application data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFetchApplication()
  }

  const handleProceedToAgentVerification = () => {
    router.push(`/verify/agents?applicationNumber=${applicationNumber}`)
  }

  const formatDocumentCode = (code: string) => code.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">DocIntel Agent</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Search Card */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Application Lookup
            </CardTitle>
            <CardDescription>
              Enter the application number to fetch details and documents from the source system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="appNumber" className="sr-only">
                  Application Number
                </Label>
                <Input
                  id="appNumber"
                  placeholder="Enter application number (e.g., APP-2025-001234)"
                  value={applicationNumber}
                  onChange={(e) => setApplicationNumber(e.target.value)}
                  className="font-mono"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Fetch
                  </>
                )}
              </Button>
            </form>

            {/* Sample application quick links */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Try:</span>
              {sampleApplications.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setApplicationNumber(num)
                    handleFetchApplication(num)
                  }}
                  className="rounded bg-muted px-2 py-1 font-mono text-xs transition-colors hover:bg-muted/80"
                >
                  {num}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Details */}
        {application && (
          <>
            <Card className="mb-6 border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Application Details
                    </CardTitle>
                    <CardDescription className="font-mono">{application.applicationNumber}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {appType?.name || application.applicationType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Applicant Name</p>
                      <p className="font-medium">{application.applicantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{application.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{application.applicantDob || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium">{application.applicantAddress || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Completeness Check */}
            <Card className="mb-6 border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Document Completeness
                    </CardTitle>
                    <CardDescription>Required documents for {appType?.name || "this application type"}</CardDescription>
                  </div>
                  {missingDocuments.length === 0 ? (
                    <Badge className="bg-success/20 text-success">Complete</Badge>
                  ) : (
                    <Badge className="bg-warning/20 text-warning">{missingDocuments.length} Missing</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {appType && (
                  <div className="space-y-3">
                    {appType.requiredDocuments.map((reqCode) => {
                      const isUploaded = documents.some((d) => mapDocumentToType(d).typeCode === reqCode)
                      return (
                        <div
                          key={reqCode}
                          className={cn(
                            "flex items-center justify-between rounded-lg border p-3",
                            isUploaded ? "border-success/50 bg-success/5" : "border-warning/50 bg-warning/5",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {isUploaded ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-warning" />
                            )}
                            <span className="font-medium">{formatDocumentCode(reqCode)}</span>
                          </div>
                          <Badge variant="outline">{isUploaded ? "Found" : "Missing"}</Badge>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fetched Documents */}
            <Card className="mb-6 border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Fetched Documents ({documents.length})
                </CardTitle>
                <CardDescription>Documents pulled from the source system with auto-detected types</CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No documents found for this application
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => {
                      const mapping = mapDocumentToType(doc)
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {(doc.fileSize / 1024).toFixed(1)} KB • {doc.metadata.sourceSystem}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">
                                {formatDocumentCode(mapping.typeCode)}
                              </Badge>
                              <p className="text-xs text-muted-foreground">{mapping.confidence}% confidence</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Ready to Process Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      {missingDocuments.length > 0
                        ? `${missingDocuments.length} required document(s) missing - processing will continue with available documents`
                        : "All required documents found - ready for verification"}
                    </p>
                  </div>
                  <Button onClick={handleProceedToAgentVerification} disabled={documents.length === 0}>
                    Start Verification
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyPageContent />
    </Suspense>
  )
}
