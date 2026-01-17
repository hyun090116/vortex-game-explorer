import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqmcbmpuexduxglvhcvu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbWNibXB1ZXhkdXhnbHZoY3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMTA5MjEsImV4cCI6MjA4MzU4NjkyMX0.DeY-PpmtdwtLM14hHw5ebWprP2QYQJFLF_iMM7oyrVU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

