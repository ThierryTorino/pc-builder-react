import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfbiwfxrdfxbuqcrhioz.supabase.co'
const supabaseKey = 'sb_publishable_WASu1krLPX7yWfktvvGWmw_a6d8zVnP'

export const supabase = createClient(supabaseUrl, supabaseKey)