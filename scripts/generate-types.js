import { createClient } from '@supabase/supabase-js'
import { writeFile } from 'fs/promises'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey.substring(0, 5) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function generateTypes() {
  try {
    console.log('Fetching types from Supabase...')
    const { data, error } = await supabase.from('_types').select('*')
    
    if (error) {
      console.error('Error fetching types:', error)
      process.exit(1)
    }

    if (!data || data.length === 0) {
      console.error('No types data received from Supabase')
      process.exit(1)
    }

    console.log('Types data received:', data)

    const types = `export type Database = {
      ${data.map(table => `
        ${table.name}: {
          Row: ${table.row_type}
          Insert: ${table.insert_type}
          Update: ${table.update_type}
        }
      `).join(',')}
    }`

    console.log('Generated types:', types)

    await writeFile('src/types/supabase.ts', types)
    console.log('Types written to src/types/supabase.ts')
  } catch (error) {
    console.error('Error generating types:', error)
    process.exit(1)
  }
}

generateTypes()
