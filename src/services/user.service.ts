import prisma from '../utils/prisma';
import { Role } from '@prisma/client';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllUsers = async () => {
  return prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUser = async (id: string, data: { name?: string; role?: Role; isActive?: boolean }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
};

export const deleteUser = async (id: string, requesterId: string) => {
  if (id === requesterId) throw new Error('You cannot delete your own account');

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  await prisma.user.delete({ where: { id } });
};
