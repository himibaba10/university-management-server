import { TLoginUser } from './auth.interface';

const loginUserFromDB = (payload: TLoginUser) => {
  const result = payload;
  console.log(result);
  return result;
};

export const authServices = {
  loginUserFromDB,
};
