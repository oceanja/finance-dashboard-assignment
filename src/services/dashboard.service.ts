import prisma from '../utils/prisma';

export const getSummary = async () => {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { isDeleted: false, type: 'INCOME' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.financialRecord.aggregate({
      where: { isDeleted: false, type: 'EXPENSE' },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpenses = Number(expenseAgg._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalRecords: incomeAgg._count + expenseAgg._count,
  };
};

export const getCategoryBreakdown = async () => {
  const records = await prisma.financialRecord.groupBy({
    by: ['category', 'type'],
    where: { isDeleted: false },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: 'desc' } },
  });

  return records.map((r) => ({
    category: r.category,
    type: r.type,
    total: Number(r._sum.amount ?? 0),
    count: r._count,
  }));
};

export const getMonthlyTrends = async () => {
  // Get records from last 12 months
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false, date: { gte: since } },
    select: { amount: true, type: true, date: true },
    orderBy: { date: 'asc' },
  });

  const monthMap: Record<string, { month: string; income: number; expenses: number }> = {};

  for (const record of records) {
    const key = record.date.toISOString().slice(0, 7); // YYYY-MM
    if (!monthMap[key]) {
      monthMap[key] = { month: key, income: 0, expenses: 0 };
    }
    if (record.type === 'INCOME') {
      monthMap[key]!.income += Number(record.amount);
    } else {
      monthMap[key]!.expenses += Number(record.amount);
    }
  }

  return Object.values(monthMap);
};

export const getRecentActivity = async (limit = 5) => {
  return prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { id: true, name: true } } },
  });
};
