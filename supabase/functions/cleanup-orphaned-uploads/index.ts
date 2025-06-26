import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get all files from storage
    const { data: files, error: listError } = await supabase.storage
      .from('product-images')
      .list('products', {
        limit: 1000,
        offset: 0,
      })

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`)
    }

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No files to clean up' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    const deletedFiles: string[] = []
    const errors: string[] = []

    // Check each file
    for (const file of files) {
      try {
        // Check if file is older than 24 hours
        const fileCreatedAt = new Date(file.created_at)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

        if (fileCreatedAt < twentyFourHoursAgo) {
          // Check if this file URL is referenced in any product
          const fileUrl = supabase.storage
            .from('product-images')
            .getPublicUrl(`products/${file.name}`).data.publicUrl

          const { data: products, error: searchError } = await supabase
            .from('products')
            .select('id, image_urls')
            .contains('image_urls', [fileUrl])

          if (searchError) {
            console.error(`Error searching for file ${file.name}:`, searchError)
            errors.push(`Failed to search for ${file.name}: ${searchError.message}`)
            continue
          }

          // If no products reference this file, delete it
          if (!products || products.length === 0) {
            const { error: deleteError } = await supabase.storage
              .from('product-images')
              .remove([`products/${file.name}`])

            if (deleteError) {
              console.error(`Error deleting file ${file.name}:`, deleteError)
              errors.push(`Failed to delete ${file.name}: ${deleteError.message}`)
            } else {
              deletedFiles.push(file.name)
              console.log(`Deleted orphaned file: ${file.name}`)
            }
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        errors.push(`Error processing ${file.name}: ${error.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Cleanup completed',
        deletedFiles,
        deletedCount: deletedFiles.length,
        errors,
        errorCount: errors.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Cleanup error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 