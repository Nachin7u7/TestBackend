import mongoConnectionInit from '../../config/dataSource';
import { argv } from 'process';
import path from 'path';


const runSeed = async (seedFile: string) => {
  await mongoConnectionInit();

  const seedPath = path.join(__dirname, seedFile);
  const seedModule = await import(seedPath);

  if (typeof seedModule.default === 'function') {
    await seedModule.default();
  } else {
    console.error(`Seed file ${seedFile} does not export a default function.`);
  }

};

const seedFile = argv[2];

if (!seedFile) {
  console.error('Please provide a seed file name as an argument.');
  process.exit(1);
}

runSeed(seedFile).catch(err => {
  console.error('Error running seed:', err);
  process.exit(1);
});
