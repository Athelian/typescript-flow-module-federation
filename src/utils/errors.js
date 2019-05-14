// @flow
import { type IntlShape } from 'react-intl';
import { toast } from 'react-toastify';
import { getByPath } from './fp';

/**
 * Transform Yup ValidationError to a more usable object
 */
export function yupToFormErrors(yupError: {
  inner: Array<{
    path: string,
    message: string,
  }>,
}): Object {
  return yupError.inner.reduce((errors, { path, message }) => {
    if (!errors[path]) {
      return { ...errors, [path]: message };
    }
    return errors;
  }, {});
}

const hasNotFoundError = (violations?: Array<Object> = []) => {
  return violations.some(item => item.error === 'not_found_error');
};

export const showToastError = ({
  result,
  entity,
  intl,
}: {
  result?: Object,
  entity: string,
  intl: IntlShape,
}) => {
  if (!result) {
    toast.error(
      intl.formatMessage({
        id: 'global.apiErrorMessage',
        defaultMessage: 'There was an error. Please try again later.',
      })
    );
    return true;
  }

  const errorType =
    getByPath(`${entity}Create.__typename`, result) ||
    getByPath(`${entity}Update.__typename`, result);
  if (errorType === 'NotFound') {
    toast.error(
      intl.formatMessage({
        id: 'global.apiEntityNotFoundErrorMessage',
        defaultMessage:
          'Sorry, but this data has been deleted. Please refresh the page and review the logs to see more details',
      })
    );
    return true;
  }

  if (
    hasNotFoundError(
      getByPath(`${entity}Create.violations`, result) ||
        getByPath(`${entity}Update.violations`, result)
    )
  ) {
    toast.error(
      intl.formatMessage({
        id: 'global.notFoundErrorMessage',
        defaultMessage:
          'You are using some data that no longer exists. Please refresh the page and try again.',
      })
    );
    return true;
  }

  return false;
};
