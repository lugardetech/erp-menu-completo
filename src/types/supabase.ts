// Update the existing types and add new ones as needed
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pedidos: {
        Row: {
          id: number
          data_pedido: string | null
          status: string
          total: number
          fornecedor_id: number | null
          meio_pagamento: string | null
          cartao_credito_id: number | null
          conta_bancaria_id: number | null
          transportadora_id: number | null
        }
        Insert: {
          id?: never
          data_pedido?: string | null
          status: string
          total: number
          fornecedor_id?: number | null
          meio_pagamento?: string | null
          cartao_credito_id?: number | null
          conta_bancaria_id?: number | null
          transportadora_id?: number | null
        }
        Update: {
          id?: never
          data_pedido?: string | null
          status?: string
          total?: number
          fornecedor_id?: number | null
          meio_pagamento?: string | null
          cartao_credito_id?: number | null
          conta_bancaria_id?: number | null
          transportadora_id?: number | null
        }
      }
      itens_pedido: {
        Row: {
          id: number
          pedido_id: number | null
          produto_id: number | null
          quantidade: number
          preco_unitario: number
        }
        Insert: {
          id?: never
          pedido_id?: number | null
          produto_id?: number | null
          quantidade: number
          preco_unitario: number
        }
        Update: {
          id?: never
          pedido_id?: number | null
          produto_id?: number | null
          quantidade?: number
          preco_unitario?: number
        }
      }
      fornecedores: {
        Row: {
          id: number
          nome: string
          contato: string | null
        }
        Insert: {
          id?: never
          nome: string
          contato?: string | null
        }
        Update: {
          id?: never
          nome?: string
          contato?: string | null
        }
      }
      carriers: {
        Row: {
          id: number
          nome: string
          contato: string | null
          area_servico: string | null
        }
        Insert: {
          id?: never
          nome: string
          contato?: string | null
          area_servico?: string | null
        }
        Update: {
          id?: never
          nome?: string
          contato?: string | null
          area_servico?: string | null
        }
      }
      produtos: {
        Row: {
          id: number
          nome: string
          descricao: string | null
          preco: number
          estoque: number
          sku: string
        }
        Insert: {
          id?: never
          nome: string
          descricao?: string | null
          preco: number
          estoque: number
          sku: string
        }
        Update: {
          id?: never
          nome?: string
          descricao?: string | null
          preco?: number
          estoque?: number
          sku?: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}