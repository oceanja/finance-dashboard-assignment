import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createRecordSchema, updateRecordSchema, recordFilterSchema } from '../validators/record.validator';
import * as recordService from '../services/record.service';
import { TransactionType } from '@prisma/client';

export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = recordFilterSchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  const records = await recordService.getRecords({
    ...result.data,
    type: result.data.type as TransactionType | undefined,
  });
  res.json(records);
};

export const getRecordById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await recordService.getRecordById(req.params['id'] as string);
    res.json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get record';
    res.status(404).json({ message });
  }
};

export const createRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = createRecordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  try {
    const record = await recordService.createRecord({
      ...result.data,
      type: result.data.type as TransactionType,
      userId: req.user!.userId,
    });
    res.status(201).json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create record';
    res.status(400).json({ message });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = updateRecordSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: 'Validation error', errors: result.error.flatten().fieldErrors });
    return;
  }

  try {
    const record = await recordService.updateRecord(req.params['id'] as string, {
      ...result.data,
      type: result.data.type as TransactionType | undefined,
    });
    res.json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update record';
    res.status(400).json({ message });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await recordService.deleteRecord(req.params['id'] as string);
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete record';
    res.status(404).json({ message });
  }
};
