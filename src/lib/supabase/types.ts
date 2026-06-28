// Tipos generados de Supabase.
// Placeholder hasta que existan las tablas en un proyecto real.
// Regenerar con:
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
//
// Mientras tanto, esto evita errores de TS y permite tipar genéricamente.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // se completará al regenerar
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
