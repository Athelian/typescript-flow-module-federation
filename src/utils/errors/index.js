// @flow
import { type IntlShape } from 'react-intl';
import { toast } from 'react-toastify';
import messages from './messages';
import { getByPath } from '../fp';

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
  return violations.some(item => ['entity_error', 'not_found_error'].includes(item.error));
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
    toast.error(intl.formatMessage(messages.apiErrorMessage));
    return true;
  }

  const errorType =
    getByPath(`${entity}Create.__typename`, result) ||
    getByPath(`${entity}Update.__typename`, result);
  if (errorType === 'NotFound') {
    toast.error(intl.formatMessage(messages.apiEntityNotFoundErrorMessage));
    return true;
  }

  if (
    hasNotFoundError(
      getByPath(`${entity}Create.violations`, result) ||
        getByPath(`${entity}Update.violations`, result)
    )
  ) {
    toast.error(intl.formatMessage(messages.notFoundErrorMessage));
    return true;
  }

  return false;
};
