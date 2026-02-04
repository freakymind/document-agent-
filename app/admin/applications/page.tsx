"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/ui/status-badge"
import { Search, Eye, FileText } from "lucide-react"
import type { Application } from "@/lib/types"

// Mock applications data
const mockApplications: (Application & { institution_name: string; document_count: number })[] = [
  {
    id: "app-1",
    institution_id: "11111111-1111-1111-1111-111111111111",
    institution_name: "Acme Financial Services",
    applicant_name: "John Smith",
    applicant_email: "john.smith@example.com",
    applicant_phone: "+1 555-0123",
    applicant_dob: "1990-05-15",
    applicant_address: "123 Main Street, City, State 12345",
    status: "verified",
    document_count: 3,
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2025-01-10T14:30:00Z",
  },
  {
    id: "app-2",
    institution_id: "11111111-1111-1111-1111-111111111111",
    institution_name: "Acme Financial Services",
    applicant_name: "Sarah Johnson",
    applicant_email: "sarah.j@example.com",
    applicant_phone: "+1 555-0456",
    applicant_dob: "1985-08-22",
    applicant_address: "456 Oak Avenue, Town, State 67890",
    status: "processing",
    document_count: 3,
    created_at: "2025-01-12T09:00:00Z",
    updated_at: "2025-01-12T09:30:00Z",
  },
  {
    id: "app-3",
    institution_id: "22222222-2222-2222-2222-222222222222",
    institution_name: "Global Bank Corp",
    applicant_name: "Mike Wilson",
    applicant_email: "mike.w@example.com",
    applicant_phone: "+1 555-0789",
    applicant_dob: "1992-03-10",
    applicant_address: "789 Pine Road, Village, State 11223",
    status: "documents_uploaded",
    document_count: 2,
    created_at: "2025-01-14T11:00:00Z",
    updated_at: "2025-01-14T11:00:00Z",
  },
  {
    id: "app-4",
    institution_id: "11111111-1111-1111-1111-111111111111",
    institution_name: "Acme Financial Services",
    applicant_name: "Emily Davis",
    applicant_email: "emily.d@example.com",
    applicant_phone: "+1 555-0321",
    applicant_dob: "1988-11-30",
    applicant_address: "321 Elm Street, Borough, State 44556",
    status: "pending",
    document_count: 0,
    created_at: "2025-01-15T08:00:00Z",
    updated_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "app-5",
    institution_id: "11111111-1111-1111-1111-111111111111",
    institution_name: "Acme Financial Services",
    applicant_name: "James Brown",
    applicant_email: "james.b@example.com",
    applicant_phone: "+1 555-0654",
    applicant_dob: "1995-07-18",
    applicant_address: "654 Maple Drive, District, State 77889",
    status: "rejected",
    document_count: 3,
    created_at: "2025-01-08T14:00:00Z",
    updated_at: "2025-01-09T10:00:00Z",
  },
]

export default function ApplicationsPage() {
  const [applications] = useState(mockApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicant_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
        <p className="text-muted-foreground">Review and manage customer onboarding applications</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="w-64 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="documents_uploaded">Documents Uploaded</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.applicant_name}</p>
                      <p className="text-sm text-muted-foreground">{application.applicant_email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{application.institution_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{application.document_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/applications/${application.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
