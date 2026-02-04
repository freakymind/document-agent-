"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, FileText } from "lucide-react"
import type { DocumentType, FieldConfig } from "@/lib/types"

// Mock data
const mockDocumentTypes: (DocumentType & { fields: FieldConfig[] })[] = [
  {
    id: "dt-1",
    institution_id: "11111111-1111-1111-1111-111111111111",
    name: "Passport",
    code: "passport",
    category: "identity",
    description: "Valid government-issued passport",
    is_required: true,
    max_file_size_mb: 10,
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    fields: [
      {
        id: "f-1",
        document_type_id: "dt-1",
        field_name: "full_name",
        field_label: "Full Name",
        field_type: "text",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "f-2",
        document_type_id: "dt-1",
        field_name: "passport_number",
        field_label: "Passport Number",
        field_type: "text",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "f-3",
        document_type_id: "dt-1",
        field_name: "date_of_birth",
        field_label: "Date of Birth",
        field_type: "date",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "f-4",
        document_type_id: "dt-1",
        field_name: "expiry_date",
        field_label: "Expiry Date",
        field_type: "date",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "dt-2",
    institution_id: "11111111-1111-1111-1111-111111111111",
    name: "Bank Statement",
    code: "bank_statement",
    category: "financial",
    description: "Recent bank statement (last 3 months)",
    is_required: true,
    max_file_size_mb: 10,
    allowed_formats: ["pdf"],
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    fields: [
      {
        id: "f-5",
        document_type_id: "dt-2",
        field_name: "account_holder",
        field_label: "Account Holder Name",
        field_type: "text",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "f-6",
        document_type_id: "dt-2",
        field_name: "account_number",
        field_label: "Account Number",
        field_type: "text",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "f-7",
        document_type_id: "dt-2",
        field_name: "closing_balance",
        field_label: "Closing Balance",
        field_type: "number",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
    ],
  },
  {
    id: "dt-3",
    institution_id: "11111111-1111-1111-1111-111111111111",
    name: "Utility Bill",
    code: "utility_bill",
    category: "financial",
    description: "Recent utility bill for address verification",
    is_required: true,
    max_file_size_mb: 10,
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    fields: [
      {
        id: "f-8",
        document_type_id: "dt-3",
        field_name: "account_holder",
        field_label: "Account Holder Name",
        field_type: "text",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "f-9",
        document_type_id: "dt-3",
        field_name: "service_address",
        field_label: "Service Address",
        field_type: "text",
        is_required: true,
        validation_regex: null,
        created_at: "2025-01-01T00:00:00Z",
      },
    ],
  },
]

const categoryColors: Record<string, string> = {
  identity: "bg-primary/20 text-primary",
  financial: "bg-success/20 text-success",
  business: "bg-warning/20 text-warning",
}

export default function DocumentTypesPage() {
  const [documentTypes, setDocumentTypes] = useState(mockDocumentTypes)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "identity" as "identity" | "financial" | "business",
    description: "",
    is_required: true,
    max_file_size_mb: 10,
  })
  const [fieldFormData, setFieldFormData] = useState({
    field_name: "",
    field_label: "",
    field_type: "text" as "text" | "date" | "number" | "boolean",
    is_required: true,
  })

  const handleSaveDocType = () => {
    const newDocType: (typeof documentTypes)[0] = {
      id: crypto.randomUUID(),
      institution_id: "11111111-1111-1111-1111-111111111111",
      ...formData,
      allowed_formats: ["pdf", "jpg", "jpeg", "png"],
      is_active: true,
      created_at: new Date().toISOString(),
      fields: [],
    }
    setDocumentTypes([...documentTypes, newDocType])
    setIsDialogOpen(false)
    setFormData({ name: "", code: "", category: "identity", description: "", is_required: true, max_file_size_mb: 10 })
  }

  const handleAddField = () => {
    if (!selectedDocType) return
    const newField: FieldConfig = {
      id: crypto.randomUUID(),
      document_type_id: selectedDocType,
      ...fieldFormData,
      validation_regex: null,
      created_at: new Date().toISOString(),
    }
    setDocumentTypes(
      documentTypes.map((dt) => (dt.id === selectedDocType ? { ...dt, fields: [...dt.fields, newField] } : dt)),
    )
    setIsFieldDialogOpen(false)
    setFieldFormData({ field_name: "", field_label: "", field_type: "text", is_required: true })
  }

  const handleDeleteField = (docTypeId: string, fieldId: string) => {
    setDocumentTypes(
      documentTypes.map((dt) =>
        dt.id === docTypeId ? { ...dt, fields: dt.fields.filter((f) => f.id !== fieldId) } : dt,
      ),
    )
  }

  const handleDeleteDocType = (id: string) => {
    setDocumentTypes(documentTypes.filter((dt) => dt.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Types</h1>
          <p className="text-muted-foreground">Configure document requirements and extraction fields</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Document Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Document Type</DialogTitle>
              <DialogDescription>Create a new document type for onboarding verification</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Passport"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                  }
                  placeholder="passport"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as "identity" | "financial" | "business" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identity">Identity</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_required">Required Document</Label>
                <Switch
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveDocType}>Create Document Type</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Field Dialog */}
      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Extraction Field</DialogTitle>
            <DialogDescription>Define a field to extract from this document type</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="field_name">Field Name</Label>
              <Input
                id="field_name"
                value={fieldFormData.field_name}
                onChange={(e) =>
                  setFieldFormData({ ...fieldFormData, field_name: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                }
                placeholder="full_name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_label">Display Label</Label>
              <Input
                id="field_label"
                value={fieldFormData.field_label}
                onChange={(e) => setFieldFormData({ ...fieldFormData, field_label: e.target.value })}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_type">Field Type</Label>
              <Select
                value={fieldFormData.field_type}
                onValueChange={(value) =>
                  setFieldFormData({ ...fieldFormData, field_type: value as "text" | "date" | "number" | "boolean" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="field_required">Required Field</Label>
              <Switch
                id="field_required"
                checked={fieldFormData.is_required}
                onCheckedChange={(checked) => setFieldFormData({ ...fieldFormData, is_required: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsFieldDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Types List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Configured Document Types</CardTitle>
          <CardDescription>
            {documentTypes.length} document type{documentTypes.length !== 1 ? "s" : ""} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {documentTypes.map((docType) => (
              <AccordionItem key={docType.id} value={docType.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{docType.name}</span>
                        <Badge variant="outline" className={categoryColors[docType.category]}>
                          {docType.category}
                        </Badge>
                        {docType.is_required && <Badge variant="secondary">Required</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{docType.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4 space-y-4 pl-14">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Extraction Fields ({docType.fields.length})</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDocType(docType.id)
                            setIsFieldDialogOpen(true)
                          }}
                        >
                          <Plus className="mr-2 h-3 w-3" /> Add Field
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocType(docType.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-3 w-3" /> Delete Type
                        </Button>
                      </div>
                    </div>
                    {docType.fields.length > 0 ? (
                      <div className="rounded-lg border border-border">
                        {docType.fields.map((field, index) => (
                          <div
                            key={field.id}
                            className={`flex items-center justify-between p-3 ${
                              index !== docType.fields.length - 1 ? "border-b border-border" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <code className="rounded bg-muted px-2 py-1 text-xs">{field.field_name}</code>
                              <span className="text-sm">{field.field_label}</span>
                              <Badge variant="outline" className="text-xs">
                                {field.field_type}
                              </Badge>
                              {field.is_required && (
                                <Badge variant="secondary" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteField(docType.id, field.id)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No extraction fields configured yet</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
