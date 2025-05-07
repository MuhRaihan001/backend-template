import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Express} from 'express';
import { fileURLToPath } from 'url';

dotenv.config();

function getFilesRecursively(dir: string): string[] {
    let results: string[] = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.resolve(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(getFilesRecursively(filePath));
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            results.push(filePath);
        }
    }
    return results;
}

/**
 * Dynamically loads API routes into the provided Express application.
 * This function scans a specified directory for route files, dynamically imports them,
 * and registers their default exports as middleware under the corresponding API endpoint path.
 * 
 * @param {Express} app - The Express application instance where the API routes will be registered.
 * 
 * @returns {Promise<void>} A promise that resolves when all routes have been successfully loaded. 
 *                          Logs successful and failed route loads to the console.
 * 
 * Directory and file handling:
 * - The directory containing the API files is defined by the environment variable `API_FILE`.
 * - Only files with the `.ts` extension are considered as route files.
 * 
 * Error Handling:
 * - Logs an error to the console if a route file cannot be loaded.
 * - Displays the exact error message for debugging purposes.
 *  
 */


export async function loadApi(app: Express, apiFolder: string) : Promise<void> {
    const routeDir = path.isAbsolute(apiFolder)
        ? apiFolder
        : path.resolve(__dirname, apiFolder);
    if(!fs.existsSync(routeDir)) return console.warn(`API directory not found: ${routeDir}`);

    const routeFiles = getFilesRecursively(routeDir);
    if(routeFiles.length === 0) return console.warn(`No API files found in directory: ${routeDir}`);
    
    console.log('Initiate API route loading...');

    for(const routePath of routeFiles){
        const relativePath = path.relative(routeDir, routePath);
        const routeBasePath = `/api/${relativePath.replace(/\.(ts|js)$/, '').split(path.sep).join('/')}`;

        try{
            app.use(routeBasePath, (await import(routePath)).default);
            console.log(`✅ | API : ${routeBasePath} Loaded`);
        }catch(error){
            console.log(`Failed to load route file: ${routePath}`, error);
        }finally{
            console.log(`Loading API finished`);
        }
    }
}