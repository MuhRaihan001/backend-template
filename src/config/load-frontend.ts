import path from "path";
import express, { Request, Response, Express } from "express";
import { promises as fsPromises } from "fs";

const staticOptions = {
    maxAge: "1y",
    etag: true,
    immutable: true,
};

export async function loadReactApp(app: Express, frontendPath: string) {
    const BUILD_DIR = path.resolve(frontendPath);
    const resolveReactPath = (...args: string[]) => path.resolve(BUILD_DIR, ...args);

    const serveIndexHtml = async (req: Request, res: Response) => {
        const indexPath = resolveReactPath("index.html");

        try {
            await fsPromises.access(indexPath);
            res.sendFile(indexPath, (sendErr) => {
                if (sendErr) {
                    console.error(`[React Serve] ⚠️ Failed to serve index.html:`, sendErr);
                    res.status(500).send("Failed to serve frontend.");
                }
            });
        } catch (err) {
            console.error(`[React Serve] ❌ index.html not found at: ${indexPath}`);
            res.status(404).send("React app not found. Please build the frontend.");
        }
    };

    try {
        await fsPromises.access(BUILD_DIR);
    } catch {
        console.warn(`[React Serve] ⚠️ Build folder not found at: ${BUILD_DIR}`);
        console.warn("Did you forget to build the frontend? Run 'npm run build' in frontend folder.");
        return;
    }

    app.use(express.static(BUILD_DIR, staticOptions));

    app.get("*", (req, res, next) => {
        if (req.path.includes("/api")) {
            return next();
        }
        serveIndexHtml(req, res);
    });
}
