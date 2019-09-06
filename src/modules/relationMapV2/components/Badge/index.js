// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { BadgeWrapperStyle } from './style';

type Props = {
  label: string,
};

const Badge = ({ label }: Props) => {
  if (!label) return null;
  return (
    <div className={BadgeWrapperStyle}>
      <FormattedMessage {...messages[label]} />
    </div>
  );
};

export default Badge;
