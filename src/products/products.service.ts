import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import type Product from '../types/Product';

@Injectable()
export class ProductsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Product[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('Products')
      .select('*')
      .order('id');

    if (error) throw new Error('Failed to fetch products');

    return data as Product[];
  }

  async findOne(id: number): Promise<Product> {
    const supabase = this.supabaseService.getClient();
    const response: PostgrestSingleResponse<Product> = await supabase
      .from('Products')
      .select('*')
      .eq('id', id)
      .single();

    const { data, error } = response;

    if (error || !data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return data;
  }
}
