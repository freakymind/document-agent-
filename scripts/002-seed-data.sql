-- Seed sample institution
INSERT INTO institutions (id, name, slug, description, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Financial Services', 'acme-financial', 'Leading financial services provider', true),
  ('22222222-2222-2222-2222-222222222222', 'Global Bank Corp', 'global-bank', 'International banking solutions', true);

-- Seed document types for Acme Financial
INSERT INTO document_types (institution_id, name, code, category, description, is_required) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Passport', 'passport', 'identity', 'Valid government-issued passport', true),
  ('11111111-1111-1111-1111-111111111111', 'Driver License', 'driver_license', 'identity', 'Valid driver license with photo', false),
  ('11111111-1111-1111-1111-111111111111', 'Bank Statement', 'bank_statement', 'financial', 'Recent bank statement (last 3 months)', true),
  ('11111111-1111-1111-1111-111111111111', 'Tax Return', 'tax_return', 'financial', 'Latest tax return document', false),
  ('11111111-1111-1111-1111-111111111111', 'Utility Bill', 'utility_bill', 'financial', 'Recent utility bill for address verification', true);

-- Seed document types for Global Bank
INSERT INTO document_types (institution_id, name, code, category, description, is_required) VALUES
  ('22222222-2222-2222-2222-222222222222', 'National ID', 'national_id', 'identity', 'Government-issued national ID card', true),
  ('22222222-2222-2222-2222-222222222222', 'Proof of Income', 'proof_income', 'financial', 'Salary slip or income certificate', true);

-- Seed field configs for Passport
INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'full_name', 'Full Name', 'text', true FROM document_types WHERE code = 'passport' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'passport_number', 'Passport Number', 'text', true FROM document_types WHERE code = 'passport' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'date_of_birth', 'Date of Birth', 'date', true FROM document_types WHERE code = 'passport' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'expiry_date', 'Expiry Date', 'date', true FROM document_types WHERE code = 'passport' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'issuing_country', 'Issuing Country', 'text', true FROM document_types WHERE code = 'passport' AND institution_id = '11111111-1111-1111-1111-111111111111';

-- Seed field configs for Bank Statement
INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'account_holder', 'Account Holder Name', 'text', true FROM document_types WHERE code = 'bank_statement' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'account_number', 'Account Number', 'text', true FROM document_types WHERE code = 'bank_statement' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'bank_name', 'Bank Name', 'text', true FROM document_types WHERE code = 'bank_statement' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'statement_date', 'Statement Date', 'date', true FROM document_types WHERE code = 'bank_statement' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'closing_balance', 'Closing Balance', 'number', true FROM document_types WHERE code = 'bank_statement' AND institution_id = '11111111-1111-1111-1111-111111111111';

-- Seed field configs for Driver License
INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'full_name', 'Full Name', 'text', true FROM document_types WHERE code = 'driver_license' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'license_number', 'License Number', 'text', true FROM document_types WHERE code = 'driver_license' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'date_of_birth', 'Date of Birth', 'date', true FROM document_types WHERE code = 'driver_license' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'expiry_date', 'Expiry Date', 'date', true FROM document_types WHERE code = 'driver_license' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'address', 'Address', 'text', false FROM document_types WHERE code = 'driver_license' AND institution_id = '11111111-1111-1111-1111-111111111111';

-- Seed field configs for Utility Bill
INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'account_holder', 'Account Holder Name', 'text', true FROM document_types WHERE code = 'utility_bill' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'service_address', 'Service Address', 'text', true FROM document_types WHERE code = 'utility_bill' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'bill_date', 'Bill Date', 'date', true FROM document_types WHERE code = 'utility_bill' AND institution_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO field_configs (document_type_id, field_name, field_label, field_type, is_required) 
SELECT id, 'amount_due', 'Amount Due', 'number', false FROM document_types WHERE code = 'utility_bill' AND institution_id = '11111111-1111-1111-1111-111111111111';
