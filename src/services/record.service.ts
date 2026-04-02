import { Prisma, TransactionType } from '@prisma/client';
import prisma from '../utils/prisma';

interface RecordFilters {
  type?: TransactionType;
  category?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}

interface CreateRecordData {
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
  userId: string;
}

export const getRecords = async (filters: RecordFilters) => {
  const where: Prisma.FinancialRecordWhereInput = { isDeleted: false };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };
  if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) where.date.gte = new Date(filters.from);
    if (filters.to) where.date.lte = new Date(filters.to);
  }

  const skip = (filters.page - 1) * filters.limit;

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: filters.limit,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    data: records,
    meta: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};

export const getRecordById = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!record) throw new Error('Record not found');
  return record;
};

export const createRecord = async (data: CreateRecordData) => {
  return prisma.financialRecord.create({
    data: {
      amount: new Prisma.Decimal(data.amount),
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes,
      userId: data.userId,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const updateRecord = async (
  id: string,
  data: { amount?: number; type?: TransactionType; category?: string; date?: string; notes?: string }
) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, isDeleted: false } });
  if (!record) throw new Error('Record not found');

  return prisma.financialRecord.update({
    where: { id },
    data: {
      ...(data.amount !== undefined && { amount: new Prisma.Decimal(data.amount) }),
      ...(data.type && { type: data.type }),
      ...(data.category && { category: data.category }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

export const deleteRecord = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, isDeleted: false } });
  if (!record) throw new Error('Record not found');

  // Soft delete
  return prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true },
  });
};
