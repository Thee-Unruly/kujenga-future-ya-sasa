// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wyahwniujcdqwctfgkce.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YWh3bml1amNkcXdjdGZna2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTAzMjUsImV4cCI6MjA2MjE2NjMyNX0.gJ_L5AkA1s1nF2IEn3b9zIj4sKtOqquqpd2MWa40K2U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);