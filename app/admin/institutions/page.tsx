"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Institution } from "@/lib/types"

// Mock data
const mockInstitutions: Institution[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Acme Financial Services",
    slug: "acme-financial",
    description: "Leading financial services provider",
    logo_url: null,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Global Bank Corp",
    slug: "global-bank",
    description: "International banking solutions",
    logo_url: null,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
]

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>(mockInstitutions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  })

  const handleOpenDialog = (institution?: Institution) => {
    if (institution) {
      setEditingInstitution(institution)
      setFormData({
        name: institution.name,
        slug: institution.slug,
        description: institution.description || "",
        is_active: institution.is_active,
      })
    } else {
      setEditingInstitution(null)
      setFormData({ name: "", slug: "", description: "", is_active: true })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingInstitution) {
      setInstitutions(
        institutions.map((inst) =>
          inst.id === editingInstitution.id ? { ...inst, ...formData, updated_at: new Date().toISOString() } : inst,
        ),
      )
    } else {
      const newInstitution: Institution = {
        id: crypto.randomUUID(),
        ...formData,
        logo_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setInstitutions([...institutions, newInstitution])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setInstitutions(institutions.filter((inst) => inst.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Institutions</h1>
          <p className="text-muted-foreground">Manage institutions and their onboarding configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Add Institution
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingInstitution ? "Edit Institution" : "Add Institution"}</DialogTitle>
              <DialogDescription>
                {editingInstitution ? "Update institution details" : "Create a new institution for document onboarding"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Acme Financial Services"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                  }
                  placeholder="acme-financial"
                />
                <p className="text-xs text-muted-foreground">Used in URLs: /apply/{formData.slug || "slug"}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the institution"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingInstitution ? "Save Changes" : "Create Institution"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Institutions</CardTitle>
          <CardDescription>
            {institutions.length} institution{institutions.length !== 1 ? "s" : ""} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutions.map((institution) => (
                <TableRow key={institution.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{institution.name}</p>
                        <p className="text-sm text-muted-foreground">{institution.description || "No description"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-2 py-1 text-sm">{institution.slug}</code>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={institution.is_active ? "verified" : "rejected"} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(institution.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(institution)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(institution.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
