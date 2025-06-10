import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { db } from './db';
import { sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations() {
  const migrationFiles = [
    '003_add_messaging_and_notifications.sql',
    '003_fix_admin_boolean.sql',
    '004_fix_budget_and_admin.sql',
    '005_fix_users_table.sql',
    '006_reset_admin_password.sql'
  ];

  console.log('Running database migrations...');

  for (const file of migrationFiles) {
    try {
      const migrationPath = join(__dirname, 'migrations', file);

      if (existsSync(migrationPath)) {
        const migrationSQL = readFileSync(migrationPath, 'utf8');
        const statements = migrationSQL.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);

        for (const statement of statements) {
          if (statement.trim()) {
            await db.execute(sql.raw(statement));
            console.log('Executed migration statement successfully');
          }
        }
      } else {
        console.log(`Migration file not found: ${file}`);
      }
    } catch (error) {
      console.error(`Error running migration ${file}:`, error);
    }
  }

  console.log('Database migrations completed successfully');
}