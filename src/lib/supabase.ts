import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://olvodfkrlzmwjgiygxrb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdm9kZmtybHptd2pnaXlneHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTIxNzUsImV4cCI6MjA5NDA2ODE3NX0.p6RGNIC6qL_8xkRMFcrYoJogKoSq3y96CrMW3nilVRM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)