import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: connections, error } = await supabase
    .from('google_connections')
    .select('id, status, scopes, created_at, last_synced_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error:', error.message);
  } else if (!connections || connections.length === 0) {
    console.log('No Google connections found yet.');
    console.log('Complete the OAuth flow in the browser...');
  } else {
    console.log('Google Connections:');
    connections.forEach((c, i) => {
      console.log(`${i+1}. Status: ${c.status} | Created: ${c.created_at}`);
      console.log(`   Scopes: ${(c.scopes as string[])?.length || 0}`);
    });
  }
}
main();
