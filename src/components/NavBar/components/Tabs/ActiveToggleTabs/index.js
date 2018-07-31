// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectUid } from 'utils/id';
import Tabs from '../index';
import messages from '../messages';

type Props = {
  onChange: number => void,
};

const tabs = [
  { icon: 'fasFolderOpen', label: <FormattedMessage {...messages.active} /> },
  { icon: 'fasArchive', label: <FormattedMessage {...messages.archived} /> },
];

function ActiveToggleTabs({ onChange }: Props) {
  return <Tabs tabs={tabs.map(injectUid)} onChange={onChange} />;
}

export default ActiveToggleTabs;
