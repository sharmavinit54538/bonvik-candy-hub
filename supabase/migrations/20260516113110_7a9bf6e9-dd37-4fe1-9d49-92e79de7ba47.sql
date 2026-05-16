create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text not null,
  mobile text not null,
  email text not null,
  state text not null,
  city text not null,
  address text not null,
  pincode text not null,
  gst_number text,
  years_in_business text,
  distribution_type text,
  monthly_capacity text,
  warehouse text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.partner_applications enable row level security;

-- Allow anonymous + authenticated visitors to submit applications
create policy "Anyone can submit partner application"
  on public.partner_applications
  for insert
  to anon, authenticated
  with check (true);

-- No select / update / delete policies => no public read access.
-- Admin tooling can be added later.