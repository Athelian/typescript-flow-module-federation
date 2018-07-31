// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Tabs from '../index';
import messages from '../messages';

type Props = {
  onChange: number => void,
};

const tabs = [
  { label: <FormattedMessage {...messages.active} /> },
  { label: <FormattedMessage {...messages.archived} /> },
];

function ActiveToggleTabs({ onChange }: Props) {
  return <Tabs tabs={tabs} onChange={onChange} />;
}

export default ActiveToggleTabs;
