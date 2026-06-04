const fs = require('fs');
const AdmZip = require('adm-zip');

const zip = new AdmZip();

function addFolder(folderPath) {
    if (!fs.existsSync(folderPath)) return;
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        if (['node_modules', '.git', 'dist'].includes(file)) continue;
        const fullPath = folderPath + '/' + file;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            zip.addLocalFolder(fullPath, fullPath.replace('./', ''));
        } else {
            // don't zip the zip itself
            if (!fullPath.includes('project_export.zip')) {
                zip.addLocalFile(fullPath, folderPath === '.' ? '' : folderPath.replace('./', ''));
            }
        }
    }
}

addFolder('.');

zip.writeZip('./public/project_export.zip');
console.log('Successfully zipped all project files!');
