import {
  getFetchResultMessages,
  snackbarMessages,
} from '@helpers/getFetchResultMessages';

const { authError, serverError, badRequestError, unknown } =
  getFetchResultMessages();
const { login } = snackbarMessages;

export const getErrorMessage = (errors) => {
  if (!errors) return { title: badRequestError };

  const { status, data } = errors;
  const errorMessage = data?.errors?.title || data?.message || null;

  switch (true) {
    case status === 400:
      return { title: badRequestError, message: errorMessage };

    case status === 401:
      return { title: authError, message: login };

    case status >= 500 && status < 600:
      return { title: serverError, message: errorMessage };

    default:
      return { title: unknown, message: errorMessage };
  }
};
