import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUserFromDB = async (payload: TLoginUser) => {
  const { id } = payload;

  const doesUserExist = await User.findOne({ id });

  if (!doesUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isDeleted = doesUserExist?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
  }

  const userStatus = doesUserExist?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  console.log(doesUserExist);

  return {};
};

export const authServices = {
  loginUserFromDB,
};
