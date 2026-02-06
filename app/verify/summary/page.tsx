'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import { FinalSummaryCard } from '@/components/final-summary'
import type { FinalSummary, ExternalApplication, ExternalDocument, ValidationResult } from '@/lib/types'

function SummaryPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const applicationNumber = searchParams.get('applicationNumber')

  const [summary, setSummary] = useState<FinalSummary | null>(null)
  const [application, setApplication] = useState<ExternalApplication | null>(null)
  const [documents, setDocuments] = useState<ExternalDocument[]>([])
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  useEffect(() => {
    if (applicationNumber) {
      // Retrieve data from sessionStorage
      const storedData = sessionStorage.getItem(`summary-${applicationNumber}`)
      if (storedData) {
        const data = JSON.parse(storedData)
        setSummary(data.summary)
        setApplication(data.application)
        setDocuments(data.documents)
        setValidationResult(data.validationResult)
      } else {
        // No data found, redirect back
        router.push('/verify')
      }
    }
  }, [applicationNumber, router])

  const handlePrint = () => {
    window.print()
  }

  const handleApprove = () => {
    // Handle approval logic
    alert('Application approved!')
    router.push('/verify')
  }

  const handleReject = () => {
    // Handle rejection logic
    alert('Application rejected. Customer will be notified to resubmit required documents.')
    router.push('/verify')
  }

  if (!summary || !application || !validationResult) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading summary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card print:hidden">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Verification
              </Button>
              <div>
                <h1 className="text-xl font-bold">Application Summary</h1>
                <p className="text-sm text-muted-foreground">
                  Application {applicationNumber}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <FinalSummaryCard
          summary={summary}
          documents={documents}
          application={application}
          validationResult={validationResult}
          isExpanded={true}
          onToggle={() => {}}
        />

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={() => router.push('/verify')}>
            New Verification
          </Button>
          {summary.overallStatus === 'rejected' ? (
            <Button variant="destructive" onClick={handleReject}>
              Reject Application
            </Button>
          ) : summary.overallStatus === 'needs_review' ? (
            <>
              <Button variant="outline" onClick={handleReject}>
                Reject
              </Button>
              <Button className="bg-warning hover:bg-warning/90" onClick={handleApprove}>
                Approve with Review
              </Button>
            </>
          ) : (
            <Button className="bg-success hover:bg-success/90" onClick={handleApprove}>
              Approve Application
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <SummaryPageContent />
    </Suspense>
  )
}
