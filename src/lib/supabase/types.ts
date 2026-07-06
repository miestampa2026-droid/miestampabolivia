// Tipos de la base de datos Mi Estampa.
// Escritos a mano a partir de supabase/migrations/*.sql.
// Regenerar cuando haya CLI/token disponible:
//   npx supabase gen types typescript --project-id ywykaivywtvcucedxnoc > src/lib/supabase/types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PaymentStatus = 'pendiente_verificacion' | 'pagado_confirmado' | 'rechazado'
export type OrderStatus = 'nuevo' | 'en_produccion' | 'listo' | 'entregado' | 'cancelado'
export type DeliveryMethod = 'envio' | 'retiro'
export type DesignSource = 'galeria' | 'subida'

export type Database = {
  public: {
    Tables: {
      products_categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
          active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products_categories']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          base_price: number
          mockup_image_url: string | null
          print_area_x: number
          print_area_y: number
          print_area_w: number
          print_area_h: number
          technique: string | null
          mockup_type: string | null
          badge: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          base_price: number
          mockup_image_url?: string | null
          print_area_x?: number
          print_area_y?: number
          print_area_w?: number
          print_area_h?: number
          technique?: string | null
          mockup_type?: string | null
          badge?: string | null
          active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          variant_type: string
          variant_value: string
          price_delta: number
          stock: number | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          variant_type: string
          variant_value: string
          price_delta?: number
          stock?: number | null
          active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
        Relationships: []
      }
      designs: {
        Row: {
          id: string
          category: string
          name: string
          image_url: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          name: string
          image_url: string
          active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['designs']['Insert']>
        Relationships: []
      }
      shipping_zones: {
        Row: {
          id: string
          name: string
          departamento: string
          cost: number
          estimated_days: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          departamento: string
          cost: number
          estimated_days?: string | null
          active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['shipping_zones']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_name: string
          customer_phone: string
          customer_email: string
          delivery_method: DeliveryMethod
          shipping_zone_id: string | null
          shipping_address: string | null
          shipping_cost: number
          subtotal: number
          total: number
          payment_status: PaymentStatus
          payment_proof_url: string | null
          order_status: OrderStatus
          notes: string | null
          customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_name: string
          customer_phone: string
          customer_email: string
          delivery_method: DeliveryMethod
          shipping_zone_id?: string | null
          shipping_address?: string | null
          shipping_cost?: number
          subtotal: number
          total: number
          payment_status?: PaymentStatus
          payment_proof_url?: string | null
          order_status?: OrderStatus
          notes?: string | null
          customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          auth_user_id: string | null
          name: string | null
          email: string | null
          phone: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          name?: string | null
          email?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
        Relationships: []
      }
      customer_addresses: {
        Row: {
          id: string
          customer_id: string
          label: string | null
          address_line: string
          city: string
          department: string
          reference: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          label?: string | null
          address_line: string
          city: string
          department: string
          reference?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['customer_addresses']['Insert']>
        Relationships: []
      }
      customer_favorites: {
        Row: {
          id: string
          customer_id: string
          product_id: string | null
          design_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id?: string | null
          design_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['customer_favorites']['Insert']>
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name_snapshot: string
          variants_snapshot: Json
          design_source: DesignSource
          design_id: string | null
          uploaded_image_url: string | null
          preview_image_url: string | null
          quantity: number
          unit_price: number
          line_total: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name_snapshot: string
          variants_snapshot?: Json
          design_source: DesignSource
          design_id?: string | null
          uploaded_image_url?: string | null
          preview_image_url?: string | null
          quantity: number
          unit_price: number
          line_total: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: []
      }
      payment_config: {
        Row: {
          id: string
          qr_image_url: string | null
          bank_name: string | null
          bank_holder: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          qr_image_url?: string | null
          bank_name?: string | null
          bank_holder?: string | null
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['payment_config']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
