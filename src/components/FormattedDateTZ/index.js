// @flow
import * as React from 'react';
import moment from 'moment';
import type { UserPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { removeZSuffix, switchTimezoneSign } from 'utils/date';

function getDateFormat(language: string, showTime: boolean) {
  if (showTime) {
    switch (language) {
      case 'en':
        return 'MM/DD/YYYY h:mm A';
      case 'jp':
        return 'YYYY/M/D H:mm';
      default:
        return 'YYYY/M/D H:mm';
    }
  }

  switch (language) {
    case 'en':
      return 'MM/DD/YYYY';
    case 'jp':
      return 'YYYY/M/D';
    default:
      return 'YYYY/M/D';
  }
}

type Props = {
  value: ?string,
  user: UserPayload,
  showTime?: boolean,
};

// Expects value in UTC pattern
export default function FormattedDateTZ({ value, user, showTime = false }: Props) {
  if (!value) return <FormattedMessage id="components.cards.na" defaultMessage="N/A" />;

  return moment
    .utc(removeZSuffix(value).concat(switchTimezoneSign(user.timezone)))
    .format(getDateFormat(user.language, showTime));
}
