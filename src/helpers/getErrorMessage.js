import {
  getSnackbarMessages,
  snackbarMessages,
} from '@helpers/getSnackbarMessages';

const { authError, serverError, badRequestError, unknown } =
  getSnackbarMessages;
const { login } = snackbarMessages;

export const getErrorMessage = (errors) => {
  if (!errors) return { title: badRequestError };

  const { status, data } = errors;

  switch (true) {
    case status === 400:
      return { title: badRequestError, message: data?.message || null };

    case status === 401:
      return { title: authError, message: login };

    case status >= 500 && status < 600:
      return { title: serverError, message: data?.message || null };

    default:
      return { title: unknown, message: data?.message || null };
  }
};
