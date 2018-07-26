// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ButtonStyle } from './style';

type Props = {
  action: 'clone' | 'remove' | 'archive',
  onClick: () => void,
};

const actionIcon = {
  remove: 'fasTrash',
  clone: 'fasClone',
  archive: 'fasArchive',
};

function BaseAction({ action, onClick }: Props) {
  const hoverColor = action === 'remove' ? 'RED' : 'BLUE';
  return (
    <button className={ButtonStyle(hoverColor)} onClick={onClick} type="button">
      <Icon icon={actionIcon[action]} />
    </button>
  );
}

export default BaseAction;
