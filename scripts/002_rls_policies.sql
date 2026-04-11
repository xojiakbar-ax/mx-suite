-- RLS Policies for Education Center Management System

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value 
  FROM public.profiles 
  WHERE id = auth.uid();
  RETURN user_role_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin (director, cto, or academic_director)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role() IN ('director', 'cto', 'academic_director');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "profiles_select_all" ON public.profiles 
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_delete_admin" ON public.profiles 
  FOR DELETE USING (public.is_admin());

-- Employees policies (admins can manage all)
CREATE POLICY "employees_select_all" ON public.employees 
  FOR SELECT USING (true);

CREATE POLICY "employees_insert_admin" ON public.employees 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "employees_update_admin" ON public.employees 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "employees_delete_admin" ON public.employees 
  FOR DELETE USING (public.is_admin());

-- Check-ins policies (users can manage own, admins can view all)
CREATE POLICY "chekin_select" ON public.chekin 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "chekin_insert_own" ON public.chekin 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chekin_update_own" ON public.chekin 
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Students policies (all authenticated users can view, admins can manage)
CREATE POLICY "students_select_all" ON public.students 
  FOR SELECT USING (true);

CREATE POLICY "students_insert" ON public.students 
  FOR INSERT WITH CHECK (public.get_user_role() IN ('director', 'cto', 'academic_director', 'academic_manager', 'administrator'));

CREATE POLICY "students_update" ON public.students 
  FOR UPDATE USING (public.get_user_role() IN ('director', 'cto', 'academic_director', 'academic_manager', 'administrator'));

CREATE POLICY "students_delete_admin" ON public.students 
  FOR DELETE USING (public.is_admin());

-- Teachers policies
CREATE POLICY "teachers_select_all" ON public.teachers 
  FOR SELECT USING (true);

CREATE POLICY "teachers_insert" ON public.teachers 
  FOR INSERT WITH CHECK (public.get_user_role() IN ('director', 'cto', 'academic_director', 'academic_manager'));

CREATE POLICY "teachers_update" ON public.teachers 
  FOR UPDATE USING (public.get_user_role() IN ('director', 'cto', 'academic_director', 'academic_manager'));

CREATE POLICY "teachers_delete_admin" ON public.teachers 
  FOR DELETE USING (public.is_admin());

-- Groups policies
CREATE POLICY "groups_select_all" ON public.groups 
  FOR SELECT USING (true);

CREATE POLICY "groups_insert" ON public.groups 
  FOR INSERT WITH CHECK (public.get_user_role() IN ('director', 'cto', 'academic_director', 'academic_manager', 'administrator'));

CREATE POLICY "groups_update" ON public.groups 
  FOR UPDATE USING (public.get_user_role() IN ('director', 'cto', 'academic_director', 'academic_manager', 'administrator'));

CREATE POLICY "groups_delete_admin" ON public.groups 
  FOR DELETE USING (public.is_admin());

-- Leads policies
CREATE POLICY "leads_select_all" ON public.leads 
  FOR SELECT USING (true);

CREATE POLICY "leads_insert" ON public.leads 
  FOR INSERT WITH CHECK (public.get_user_role() IN ('director', 'cto', 'marketing_manager', 'administrator'));

CREATE POLICY "leads_update" ON public.leads 
  FOR UPDATE USING (public.get_user_role() IN ('director', 'cto', 'marketing_manager', 'administrator'));

CREATE POLICY "leads_delete_admin" ON public.leads 
  FOR DELETE USING (public.is_admin());

-- Tasks policies
CREATE POLICY "tasks_select" ON public.tasks 
  FOR SELECT USING (auth.uid() = assigned_to OR auth.uid() = assigned_by OR public.is_admin());

CREATE POLICY "tasks_insert" ON public.tasks 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "tasks_update" ON public.tasks 
  FOR UPDATE USING (auth.uid() = assigned_to OR auth.uid() = assigned_by OR public.is_admin());

CREATE POLICY "tasks_delete" ON public.tasks 
  FOR DELETE USING (auth.uid() = assigned_by OR public.is_admin());

-- Budget requests policies
CREATE POLICY "budget_requests_select" ON public.budget_requests 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "budget_requests_insert" ON public.budget_requests 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "budget_requests_update" ON public.budget_requests 
  FOR UPDATE USING (public.is_admin());

-- Payments policies
CREATE POLICY "payments_select" ON public.payments 
  FOR SELECT USING (public.get_user_role() IN ('director', 'cto', 'administrator'));

CREATE POLICY "payments_insert" ON public.payments 
  FOR INSERT WITH CHECK (public.get_user_role() IN ('director', 'cto', 'administrator'));

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications 
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "notifications_insert" ON public.notifications 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_update_own" ON public.notifications 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON public.notifications 
  FOR DELETE USING (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "support_tickets_select" ON public.support_tickets 
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "support_tickets_insert" ON public.support_tickets 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "support_tickets_update" ON public.support_tickets 
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
