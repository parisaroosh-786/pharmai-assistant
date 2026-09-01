/*
Simple generator: read data/drugs.json (array of drug objects) and write drugProfiles.ts
Run: node scripts/generate_drugProfiles.js
*/
const fs = require('fs');
const path = require('path');
const inPath = path.join(__dirname, '..', 'data', 'drugs.json');
const outPath = path.join(__dirname, '..', 'drugProfiles.ts');

if (!fs.existsSync(inPath)) {
  console.error('No data/drugs.json file found. Create one with an array of drug objects.');
  process.exit(1);
}

const raw = fs.readFileSync(inPath, 'utf8');
let arr;
try {
  arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error('Expected an array');
} catch (e) {
  console.error('Failed to parse data/drugs.json:', e.message);
  process.exit(1);
}

function serializeString(s){
  return JSON.stringify(s).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

const entries = arr.map((d) => {
  const key = (d.genericName || d.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'drug_' + Math.random().toString(36).slice(2,8);
  const obj = {
    genericName: d.genericName || d.name || '',
    brandNames: d.brandNames || d.brand || [],
    drugClass: d.drugClass || d.class || '',
    mechanismOfAction: d.mechanismOfAction || d.moa || '',
    pharmacologicalEffects: d.pharmacologicalEffects || d.pharmacologicalEffects || '',
    indications: d.indications || [],
    dosageAndAdministration: d.dosageAndAdministration || d.dosage || '',
    commonSideEffects: d.commonSideEffects || d.sideEffects || [],
    seriousAdverseEffects: d.seriousAdverseEffects || d.seriousAdverseEffects || [],
    contraindications: d.contraindications || [],
    drugDrugInteractions: d.drugDrugInteractions || d.interactions || [],
    drugFoodInteractions: d.drugFoodInteractions || [],
    monitoringParameters: d.monitoringParameters || [],
    patientCounseling: d.patientCounseling || [],
    storageInformation: d.storageInformation || '',
    patientFactorDependency: d.patientFactorDependency || '',
    pharmacyStudentTip: d.pharmacyStudentTip || ''
  };
  return `  ${key}: ${JSON.stringify(obj, null, 2)}`;
});

const template = `import { DrugProfile } from "./src/types";

export const DRUG_PROFILES: Record<string, DrugProfile> = {
${entries.join(',\n')}
};
`;

fs.writeFileSync(outPath, template, 'utf8');
console.log('Wrote', outPath, 'with', arr.length, 'entries');
