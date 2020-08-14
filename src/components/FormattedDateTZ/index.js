// @flow
import * as React from 'react';
import moment from 'moment';
import type { UserPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { removeZSuffix, switchTimezoneSign } from 'utils/date';

function getDateFormat(language: string) {
  switch (language) {
    case 'en':
      return 'MM/DD/YYYY h:mm A';
    case 'jp':
      return 'YYYY/M/D H:mm';
    default:
      return 'YYYY/M/D H:mm';
  }
}

type Props = {
  value: ?string,
  user: UserPayload,
};

export default function FormattedDateTZ({ value, user }: Props) {
  if (!value) return <FormattedMessage id="components.cards.na" defaultMessage="N/A" />;

  return moment
    .utc(removeZSuffix(value).concat(switchTimezoneSign(user.timezone)))
    .format(getDateFormat(user.language));
}
