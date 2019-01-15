// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { injectUid } from 'utils/id';
import Tabs from '../index';
import messages from '../messages';

type OptionalProps = {
  activeIndex?: number,
};
type Props = OptionalProps & {
  onChange: number => void,
};

const tabs = [
  { icon: 'ACTIVE', label: <FormattedMessage {...messages.active} /> },
  { icon: 'ARCHIVE', label: <FormattedMessage {...messages.archived} /> },
];

function StatusToggleTabs({ onChange, activeIndex }: Props) {
  return (
    <Tabs
      tabs={tabs.map(injectUid)}
      onChange={onChange}
      {...(activeIndex ? { activeIndex } : {})}
    />
  );
}

export default StatusToggleTabs;
