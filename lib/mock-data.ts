// Mock data generator for dummy AI processing
export function generateQualityScore(): number {
  return Math.round((70 + Math.random() * 30) * 100) / 100
}

export function generateTamperingScore(): number {
  return Math.round((85 + Math.random() * 15) * 100) / 100
}

export function generateQualityIssues(score: number): string[] {
  const issues: string[] = []
  if (score < 80) {
    const possibleIssues = [
      "Image slightly blurry",
      "Low resolution detected",
      "Uneven lighting",
      "Document edges not fully visible",
      "Glare detected on surface",
    ]
    const numIssues = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < numIssues; i++) {
      const randomIssue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)]
      if (!issues.includes(randomIssue)) {
        issues.push(randomIssue)
      }
    }
  }
  return issues
}

export function generateTamperingFlags(score: number): string[] {
  const flags: string[] = []
  if (score < 95) {
    const possibleFlags = [
      "Minor font inconsistency detected",
      "Slight edge irregularity",
      "Metadata timestamp mismatch",
      "Compression artifacts detected",
    ]
    if (Math.random() > 0.7) {
      flags.push(possibleFlags[Math.floor(Math.random() * possibleFlags.length)])
    }
  }
  return flags
}

export function generateMockExtraction(
  documentType: string,
  applicantName: string,
): Record<string, { value: string; confidence: number }> {
  const baseConfidence = 85 + Math.random() * 15

  const extractions: Record<string, Record<string, { value: string; confidence: number }>> = {
    passport: {
      full_name: { value: applicantName, confidence: baseConfidence },
      passport_number: {
        value: `P${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        confidence: baseConfidence - 5,
      },
      date_of_birth: { value: "1990-05-15", confidence: baseConfidence - 2 },
      expiry_date: { value: "2028-05-14", confidence: baseConfidence - 3 },
      issuing_country: { value: "United States", confidence: baseConfidence },
    },
    driver_license: {
      full_name: { value: applicantName, confidence: baseConfidence },
      license_number: {
        value: `DL${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        confidence: baseConfidence - 5,
      },
      date_of_birth: { value: "1990-05-15", confidence: baseConfidence - 2 },
      expiry_date: { value: "2027-05-14", confidence: baseConfidence - 3 },
      address: { value: "123 Main Street, City, State 12345", confidence: baseConfidence - 10 },
    },
    bank_statement: {
      account_holder: { value: applicantName, confidence: baseConfidence },
      account_number: { value: `****${Math.floor(1000 + Math.random() * 9000)}`, confidence: baseConfidence - 5 },
      bank_name: { value: "First National Bank", confidence: baseConfidence },
      statement_date: { value: "2025-12-31", confidence: baseConfidence - 2 },
      closing_balance: { value: `$${(Math.random() * 50000 + 5000).toFixed(2)}`, confidence: baseConfidence - 8 },
    },
    utility_bill: {
      account_holder: { value: applicantName, confidence: baseConfidence },
      service_address: { value: "123 Main Street, City, State 12345", confidence: baseConfidence - 5 },
      bill_date: { value: "2025-12-15", confidence: baseConfidence - 2 },
      amount_due: { value: `$${(Math.random() * 200 + 50).toFixed(2)}`, confidence: baseConfidence - 3 },
    },
    tax_return: {
      full_name: { value: applicantName, confidence: baseConfidence },
      tax_year: { value: "2024", confidence: baseConfidence },
      total_income: { value: `$${(Math.random() * 100000 + 30000).toFixed(2)}`, confidence: baseConfidence - 10 },
      filing_status: { value: "Single", confidence: baseConfidence - 5 },
    },
  }

  return (
    extractions[documentType] || {
      extracted_text: { value: "Document content extracted", confidence: baseConfidence },
    }
  )
}

export function verifyExtractedData(
  extractedValue: string,
  applicationValue: string | null,
): { match: boolean; confidence: number } {
  if (!applicationValue) {
    return { match: true, confidence: 70 }
  }

  const normalizedExtracted = extractedValue.toLowerCase().trim()
  const normalizedApplication = applicationValue.toLowerCase().trim()

  if (normalizedExtracted === normalizedApplication) {
    return { match: true, confidence: 100 }
  }

  if (normalizedExtracted.includes(normalizedApplication) || normalizedApplication.includes(normalizedExtracted)) {
    return { match: true, confidence: 85 }
  }

  return { match: false, confidence: 50 }
}
