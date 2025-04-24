import { supabase } from '../src/lib/supabase';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  const migrationsDir = join(__dirname, '../supabase/migrations');
  
  // Применяем каждую миграцию по порядку
  const migrationFiles = [
    '20240421150000_create_face_profiles.sql',
    '20240421150001_create_health_events.sql'
  ];

  for (const file of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    const { error } = await supabase.rpc('execute_sql', { sql });
    
    if (error) {
      console.error(`Migration failed: ${file}`, error);
      process.exit(1);
    }
    console.log(`Migration applied: ${file}`);
  }
}

runMigrations().catch(console.error);