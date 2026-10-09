-- Migration: Create leads and admin_users tables, updated_at trigger, RLS policies, and Realtime replication
-- Developed for Bonvik Foods / Equinoxsphere

-- 1. Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'New',
  priority text not null default 'Medium',
  source text not null default 'Contact Form',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Trigger for updated_at on leads
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_leads_updated_at on public.leads;
create trigger trigger_leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- 3. Create admin_users table for role management
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- 4. Helper function to check admin privileges
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select (
    exists (
      select 1 from public.admin_users where id = auth.uid()
    )
    or (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
    or (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin')
    or (coalesce(auth.jwt() ->> 'role', '') = 'service_role')
  );
$$;

-- 5. RLS policies on admin_users
drop policy if exists "Admins can select admin_users" on public.admin_users;
create policy "Admins can select admin_users"
  on public.admin_users
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert admin_users" on public.admin_users;
create policy "Admins can insert admin_users"
  on public.admin_users
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update admin_users" on public.admin_users;
create policy "Admins can update admin_users"
  on public.admin_users
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete admin_users" on public.admin_users;
create policy "Admins can delete admin_users"
  on public.admin_users
  for delete
  to authenticated
  using (public.is_admin());

-- 6. RLS policies on leads table
alter table public.leads enable row level security;

-- Anon + authenticated can insert leads
drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated admins can select, update, delete leads
drop policy if exists "Admins can select leads" on public.leads;
create policy "Admins can select leads"
  on public.leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.is_admin());

-- 7. Admin policies on partner_applications table
drop policy if exists "Admins can select partner_applications" on public.partner_applications;
create policy "Admins can select partner_applications"
  on public.partner_applications
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update partner_applications" on public.partner_applications;
create policy "Admins can update partner_applications"
  on public.partner_applications
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete partner_applications" on public.partner_applications;
create policy "Admins can delete partner_applications"
  on public.partner_applications
  for delete
  to authenticated
  using (public.is_admin());

-- 8. Enable Realtime publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;

  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'partner_applications'
  ) then
    alter publication supabase_realtime add table public.partner_applications;
  end if;
end $$;
