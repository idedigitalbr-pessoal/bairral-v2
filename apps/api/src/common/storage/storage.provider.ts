import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

export interface StorageSaveResult {
  fileName: string;
  storagePath: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}

export interface IStorageProvider {
  saveFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<StorageSaveResult>;
  getFilePath(storagePath: string): Promise<string>;
  deleteFile(storagePath: string): Promise<void>;
}

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly uploadDir: string;
  private readonly maxFileSize = 20 * 1024 * 1024; // 20 MB

  private readonly allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'audio/mpeg',
    'video/mp4',
    'application/zip',
  ];

  private readonly allowedExtensions = [
    '.pdf', '.png', '.jpg', '.jpeg', '.txt', '.doc', '.docx', '.xls', '.xlsx', '.mp3', '.mp4', '.zip'
  ];

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<StorageSaveResult> {
    if (fileBuffer.length > this.maxFileSize) {
      throw new BadRequestException('O arquivo excede o limite máximo permitido de 20MB');
    }

    const ext = path.extname(originalName).toLowerCase();
    if (!this.allowedExtensions.includes(ext) || !this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(`Tipo ou extensão de arquivo não suportado: ${ext} (${mimeType})`);
    }

    // Prevencao de path traversal e geracao de nome seguro
    const sanitizedOriginal = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeName = `${Date.now()}_${randomBytes(8).toString('hex')}${ext}`;
    const destinationPath = path.join(this.uploadDir, safeName);

    // Check path traversal
    const resolvedPath = path.resolve(destinationPath);
    if (!resolvedPath.startsWith(this.uploadDir)) {
      throw new BadRequestException('Operação inválida de caminho de arquivo (path traversal)');
    }

    await fs.promises.writeFile(destinationPath, fileBuffer);

    return {
      fileName: safeName,
      storagePath: safeName,
      originalName: sanitizedOriginal,
      mimeType,
      fileSize: fileBuffer.length,
    };
  }

  async getFilePath(storagePath: string): Promise<string> {
    const fullPath = path.resolve(this.uploadDir, path.basename(storagePath));
    if (!fullPath.startsWith(this.uploadDir)) {
      throw new BadRequestException('Caminho de arquivo inválido');
    }
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Arquivo não encontrado no armazenamento');
    }
    return fullPath;
  }

  async deleteFile(storagePath: string): Promise<void> {
    const fullPath = path.resolve(this.uploadDir, path.basename(storagePath));
    if (!fullPath.startsWith(this.uploadDir)) {
      throw new BadRequestException('Caminho de arquivo inválido');
    }
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }
}
