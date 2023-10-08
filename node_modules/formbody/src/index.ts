import { NextFunction, Request, Response } from 'express';
import { inspect } from 'util';
import Busboy from 'busboy';

export interface FormbodyFile {
  buffer: Buffer;
  filename: string;
  size?: number;
  mimetype?: string;
}

export interface FormbodyItem {
  field: string;
  value?: string;
  file?: FormbodyFile;
}

export const formbody = (req: Request, res: Response, next: NextFunction) => {
  if (req.method.toUpperCase() !== 'POST' || !req.is('multipart/form-data')) {
    return next();
  }

  const busboy = new Busboy({ headers: req.headers });
  const body: FormbodyItem[] = [];

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (!filename) {
      return;
    }

    const chunks: Uint8Array[] = [];

    file.on('data', (chunk) => {
      chunks.push(chunk);
    });

    file.on('error', (err) => {
      res.status(500).json({
        code: 'form_filter_error',
      });
    });

    file.on('end', () => {
      const finalBuffer = Buffer.concat(chunks);

      body.push({
        field: fieldname,
        file: {
          buffer: finalBuffer,
          size: finalBuffer.length,
          filename: filename,
          mimetype: mimetype,
        },
      });
    });
  });

  busboy.on('field', function (fieldname, val) {
    body.push({
      field: fieldname,
      value: inspect(val).replace(/(^')|('$)/g, ''),
    });
  });

  busboy.on('finish', function () {
    req.body = body;
    next();
  });

  req.pipe(busboy);
};
