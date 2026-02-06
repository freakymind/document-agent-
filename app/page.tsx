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
            Commercial Onboarding
            <br />
            <span className="text-primary">Document Intelligence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            UK commercial and institutional banking onboarding verification. Automatically fetch documents, validate against 
            regulatory requirements (MLR 2017, FCA, JMLSG), and process for quality, tampering, and KYC data extraction.
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
              <CardTitle className="mt-4">Companies House Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Auto-fetch incorporation certificates, M&A documents, and filing history directly via Companies House API.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <FileCheck className="h-10 w-10 text-accent" />
              <CardTitle className="mt-4">Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Validate documents against UK MLR 2017, FCA requirements, and JMLSG guidance based on customer complexity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <Shield className="h-10 w-10 text-success" />
              <CardTitle className="mt-4">Enhanced Due Diligence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated EDD checks for high-risk customers, PEP screening, sanctions checks (OFSI/OFAC), and adverse media.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <Brain className="h-10 w-10 text-warning" />
              <CardTitle className="mt-4">KYC/CDD Extraction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI extraction of UBO details, director information, and cross-validation against application data.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold">Sample Corporate Applications</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Test with sample UK commercial banking applications across different complexity levels
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
