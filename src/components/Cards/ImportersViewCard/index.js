// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
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
        {count}{' '}
        <FormattedMessage id="components.NavBar.Filter.importers" defaultMessage="Importers" />
      </div>
      <BaseButton
        icon="IMPORTERS"
        label={
          <FormattedMessage id="components.Header.notification.viewAll" defaultMessage="View All" />
        }
        backgroundColor="TEAL"
        hoverBackgroundColor="TEAL_DARK"
        onClick={onClick}
      />
    </div>
  );
};

ImportersViewCard.defaultProps = defaultProps;

export default ImportersViewCard;
