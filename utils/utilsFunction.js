import rateLimit from "express-rate-limit";
// Apply to all requests
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." }
});

// OS specific path separator
import { exec } from 'child_process';
import os from 'os'
import util from 'util'
const execAsync = util.promisify(exec);

/**
 * Utility function to get RAM and disk usage for all partitions
 */
export function usege(req, res) {
  getSystemUsage()
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
}
async function getSystemUsage() {
  // RAM usage
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const ramUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

  // Disk usage for all mounted partitions
  try {
    const { stdout } = await execAsync("df -h --output=source,size,used,avail,pcent,target -x tmpfs -x devtmpfs | tail -n +2");
    // Parse each line into objects
    const partitions = stdout.trim().split("\n").map(line => {
      const [filesystem, size, used, avail, usePercent, mountpoint] = line.trim().split(/\s+/);
      return { filesystem, size, used, available: avail, usagePercent: usePercent, mountpoint };
    });

    return {
      ram: {
        total: `${(totalMem / 1024 / 1024).toFixed(2)} MB`,
        used: `${(usedMem / 1024 / 1024).toFixed(2)} MB`,
        usagePercent: `${ramUsagePercent}%`,
      },
      disk: partitions,
    };
  } catch (err) {
    throw new Error("Failed to get disk usage");
  }
}

import path from 'path';
import fs from 'fs';

export function FolderDetails(pathString){

 function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath).sort(); // Ensure consistent order
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.lstatSync(filePath); // safer than statSync
        if (stat.isDirectory()) {
            getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });
    return arrayOfFiles;
}


      const folderPath=pathString
      const files = getAllFiles(folderPath);
      const lst =[];
      for (let filePath of files){
      if ( fs.statSync(filePath).isFile()){
        const fileName=path.basename(filePath);
        const catogary = path.basename(path.dirname(filePath)).toLowerCase(); // normalize
        lst.push({fileName,catogary});
      }}
    return lst;

}

export function FolderDetailsInObject(pathString){
        const allFiles = FolderDetails(pathString);
        const fileObj = {};
        allFiles.forEach(({fileName, catogary}) => {
            if (!fileObj[catogary]) {
                fileObj[catogary] = [];
            }
            fileObj[catogary].push(fileName);
        });
        const lst=[]
        for (let key in fileObj) {
            lst.push({folderName:key,files:fileObj[key]})
        }
        return lst;
}