-- Document Intelligence Agent Schema
-- Institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document types table (configurable per institution)
CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'identity', 'financial', 'business'
  description TEXT,
  is_required BOOLEAN DEFAULT true,
  max_file_size_mb INTEGER DEFAULT 10,
  allowed_formats TEXT[] DEFAULT ARRAY['pdf', 'jpg', 'jpeg', 'png'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(institution_id, code)
);

-- Field configurations for each document type
CREATE TABLE IF NOT EXISTS field_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type_id UUID REFERENCES document_types(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_label VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) DEFAULT 'text', -- 'text', 'date', 'number', 'boolean'
  is_required BOOLEAN DEFAULT true,
  validation_regex TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_type_id, field_name)
);

-- Customer applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(50),
  applicant_dob DATE,
  applicant_address TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'documents_uploaded', 'processing', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Uploaded documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  document_type_id UUID REFERENCES document_types(id),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded', 'processing', 'quality_check', 'tampering_check', 'extracting', 'verifying', 'completed', 'failed'
  quality_score DECIMAL(5,2),
  tampering_score DECIMAL(5,2),
  quality_issues JSONB DEFAULT '[]',
  tampering_flags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extraction results
CREATE TABLE IF NOT EXISTS extraction_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  extracted_value TEXT,
  confidence_score DECIMAL(5,2),
  is_verified BOOLEAN DEFAULT false,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, field_name)
);

-- Processing logs
CREATE TABLE IF NOT EXISTS processing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  step VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'started', 'completed', 'failed'
  message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
