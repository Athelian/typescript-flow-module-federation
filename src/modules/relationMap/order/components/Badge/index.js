// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'modules/relationMap/messages';
import * as style from './style';

type Props = {
  label: string,
};

const Badge = ({ label }: Props) => (
  <div className={style.ContainerWrapper}>
    <FormattedMessage {...messages[label.toLowerCase()] || messages.newItem} />
  </div>
);

export default Badge;
