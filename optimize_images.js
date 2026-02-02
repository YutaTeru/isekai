import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('zukan');
const BACKUP_DIR = path.resolve('zukan_original');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

async function processImages() {
    const files = fs.readdirSync(TARGET_DIR).filter(f => f.match(/\.(png|jpg|jpeg)$/i));

    console.log(`Found ${files.length} images to process.`);

    for (const file of files) {
        const targetPath = path.join(TARGET_DIR, file);
        const backupPath = path.join(BACKUP_DIR, file);

        // Backup if not exists
        if (!fs.existsSync(backupPath)) {
            try {
                fs.copyFileSync(targetPath, backupPath);
            } catch (e) {
                console.error(`Failed to backup ${file}`, e);
                continue;
            }
        }

        // Use backup as source if available (to prevent re-compression of low quality)
        const sourcePath = fs.existsSync(backupPath) ? backupPath : targetPath;

        // Optimize
        try {
            await sharp(sourcePath)
                .resize({ width: 800, withoutEnlargement: true }) // reasonable max width
                .png({ quality: 80, compressionLevel: 9, force: true })
                .toFile(targetPath + '.tmp');

            // Retry rename loop for Windows locking issues
            let retries = 3;
            while (retries > 0) {
                try {
                    if (fs.existsSync(targetPath)) {
                        fs.unlinkSync(targetPath); // Explicit delete
                    }
                    fs.renameSync(targetPath + '.tmp', targetPath);
                    console.log(`Optimized: ${file}`);
                    break;
                } catch (err) {
                    retries--;
                    if (retries === 0) throw err;
                    await new Promise(r => setTimeout(r, 1000)); // Wait 1s
                }
            }
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
            // Cleanup tmp
            if (fs.existsSync(targetPath + '.tmp')) fs.unlinkSync(targetPath + '.tmp');
        }
    }
}

processImages();
