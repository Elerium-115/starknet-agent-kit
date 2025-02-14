import {
  Injectable,
  ForbiddenException,
  ExecutionContext,
  CanActivate,
} from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { promises as fs } from 'fs';
import { join } from 'path';

interface FileSignature {
  mime: string;
  signatures: Array<number[]>;
}

interface UploadedFile {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
}

@Injectable()
export class FileTypeGuard implements CanActivate {
  private readonly uploadDir = 'uploads';
  private readonly fileSignatures: FileSignature[] = [
    {
      mime: 'application/json',
      signatures: [[0x7b], [0x5b]],
    },
    {
      mime: 'application/zip',
      signatures: [[0x50, 0x4b, 0x03, 0x04]],
    },
  ];

  constructor(private readonly allowedMimeTypes: string[] = []) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (!request.isMultipart()) {
      throw new ForbiddenException('The request must be multipart');
    }
    await this.ensureUploadDirExists();

    try {
      const parts = request.parts();
      const uploadedFiles: UploadedFile[] = [];

      for await (const part of parts) {
        if (part.type === 'file') {
          const file = part as MultipartFile;
          const uploadedFile = await this.saveFile(file);
          const buffer = await fs.readFile(uploadedFile.path);

          const isFile = await this.validateFile(buffer);
          if (!isFile) {
            const isJson = await this.validateJson(buffer);
            if (!isJson) {
              fs.unlink(uploadedFile.path);
              throw new ForbiddenException('Unauthorized file type');
            }
          }

          uploadedFiles.push(uploadedFile);
        }
      }

      (request as any).uploadedFiles = uploadedFiles;

      return true;
    } catch (error) {
      await this.cleanupFiles();

      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Erreur lors du traitement du fichier');
    }
  }

  private async saveFile(file: MultipartFile): Promise<UploadedFile> {
    const buffer = await file.toBuffer();
    const filename = file.filename;
    const filepath = join(this.uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    const originalSize = buffer.length;
    const writtenSize = (await fs.stat(filepath)).size;

    if (originalSize !== writtenSize) {
      throw new Error(
        `File integrity check failed: original size ${originalSize} != written size ${writtenSize}`
      );
    }

    return {
      originalName: file.filename,
      filename: filename,
      mimetype: file.mimetype,
      size: buffer.length,
      path: filepath,
    };
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private async cleanupFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.uploadDir);
      for (const file of files) {
        await fs.unlink(join(this.uploadDir, file));
      }
    } catch (error) {
      console.error('Error while cleaning files:', error);
    }
  }

  private async validateFile(buffer: Buffer): Promise<boolean> {
    const fileType = this.detectFileType(buffer);

    if (!fileType) {
      return false;
    }

    return (
      this.allowedMimeTypes.length === 0 ||
      this.allowedMimeTypes.includes(fileType)
    );
  }

  private async validateJson(buffer: Buffer): Promise<boolean> {
    try {
      const content = buffer.toString('utf8').trim();

      if (!content.startsWith('{') && !content.startsWith('[')) {
        return false;
      }

      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }

  private detectFileType(buffer: Buffer): string | null {
    for (const fileSignature of this.fileSignatures) {
      if (this.checkSignature(buffer, fileSignature.signatures)) {
        return fileSignature.mime;
      }
    }
    return null;
  }

  private checkSignature(buffer: Buffer, signatures: number[][]): boolean {
    return signatures.some((signature) => {
      return signature.every((byte, index) => buffer[index] === byte);
    });
  }
}
