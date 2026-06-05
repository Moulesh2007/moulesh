import { execFileSync } from 'child_process';

try {
  console.log('Generating Prisma client...');
  execFileSync(process.execPath, ['node_modules/prisma/build/index.js', 'generate'], { stdio: 'inherit' });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}
