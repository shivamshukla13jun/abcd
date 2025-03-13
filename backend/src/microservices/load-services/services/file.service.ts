import fs from 'fs/promises';
import path from 'path';

export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export class FileService {
    private static UPLOAD_DIR = path.join(__dirname, '../../../../uploads/loads');

    static async initialize(): Promise<void> {
        try {
            await fs.access(this.UPLOAD_DIR);
        } catch {
            await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
        }
    }

    static async deleteFiles(files: MulterFile[] | string[]): Promise<void> {
        for (const file of files) {
            try {
                const filename = typeof file === 'string' ? file : file.filename;
                await fs.unlink(path.join(this.UPLOAD_DIR, filename));
            } catch (error) {
                console.error(`Error deleting file ${typeof file === 'string' ? file : file.filename}:`, error);
            }
        }
    }

    static getUploadPath(): string {
        return this.UPLOAD_DIR;
    }

    static getFileUrl(filename: string): string {
        return `/api/loads/documents/${filename}`;
    }
}

// Initialize upload directory
FileService.initialize();
