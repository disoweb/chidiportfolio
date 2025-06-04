
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './db';
import { sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Read the migration file
    const migrationPath = join(__dirname, 'migrations', '001_add_admin_tables.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(sql.raw(statement));
        console.log('Executed migration statement successfully');
      }
    }
    
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
