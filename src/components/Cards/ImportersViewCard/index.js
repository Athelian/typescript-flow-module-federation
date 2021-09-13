// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import { ImportersCardStyle, ImporterIconStyle, ImporterCardHeaderStyle } from './style';

type Props = {|
  onClick: Function,
  count: number,
|};

const defaultProps = {
  onClick: () => {},
  count: 0,
};

const ImportersViewCard = ({ count, onClick }: Props) => {
  return (
    <div className={ImportersCardStyle} role="presentation" onClick={onClick}>
      <div className={ImporterCardHeaderStyle}>
        <div className={ImporterIconStyle}>
          <Icon icon="IMPORTER" />
        </div>
        {count} Importers
      </div>
    </div>
  );
};

ImportersViewCard.defaultProps = defaultProps;

export default withForbiddenCard(ImportersViewCard, 'partner', {
  width: '195px',
  height: '215px',
  entityIcon: 'PARTNER',
  entityColor: 'PARTNER',
});
