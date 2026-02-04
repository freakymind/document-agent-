import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, Shield, Brain, Building2, Search } from "lucide-react"
import { getSampleApplicationNumbers } from "@/lib/external-system-mock"

export default function HomePage() {
  const sampleApplications = getSampleApplicationNumbers()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">DocIntel Agent</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/verify">
              <Button variant="ghost">Verify Application</Button>
            </Link>
            <Link href="/admin">
              <Button>Admin Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Document Intelligence
            <br />
            <span className="text-primary">Verification Agent</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Enter an application number to automatically fetch documents from the source system, validate completeness
            against configuration, and process each document for quality, tampering, and data extraction.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/verify">
              <Button size="lg" className="gap-2">
                <Search className="h-4 w-4" /> Verify Application
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Building2 className="h-4 w-4" /> Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <Search className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">Auto-Fetch Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatically pull application details and uploaded documents from the source system using application
                number.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <FileCheck className="h-10 w-10 text-accent" />
              <CardTitle className="mt-4">Completeness Check</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Match fetched documents against configured requirements based on application type to identify missing
                documents.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <Shield className="h-10 w-10 text-success" />
              <CardTitle className="mt-4">Quality & Tampering</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered analysis for document quality (blur, resolution) and fraud detection (manipulation,
                anomalies).
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <Brain className="h-10 w-10 text-warning" />
              <CardTitle className="mt-4">AI Extraction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Extract key attributes from documents and verify them against application data with confidence scoring.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold">Sample Applications</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Try the verification flow with these pre-configured application numbers
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {sampleApplications.map((appNum) => (
              <Link key={appNum} href={`/verify?applicationNumber=${appNum}`}>
                <Card className="cursor-pointer border-border bg-card transition-colors hover:border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base font-mono">
                      <FileCheck className="h-4 w-4 text-primary" />
                      {appNum}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">Click to verify this application</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
