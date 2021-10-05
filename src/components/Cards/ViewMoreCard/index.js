// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { ViewMoreCardStyle, ViewMoreIconStyle, ViewMoreCardHeaderStyle } from './style';

type Props = {|
  onClick: Function,
  count: number,
  cardType: string,
  readOnly?: boolean,
|};

const defaultProps = {
  onClick: () => {},
  count: 0,
};

const ViewMoreCard = ({ count, onClick, cardType, readOnly = false }: Props) => {
  return (
    <div className={ViewMoreCardStyle(readOnly)} role="presentation" onClick={onClick}>
      <div className={ViewMoreCardHeaderStyle}>
        <div className={ViewMoreIconStyle}>
          <Icon icon={cardType} />
        </div>
        {count}{' '}
        {cardType === 'FORWARDER' && (
          <FormattedMessage id="components.NavBar.Filter.forwarders" defaultMessage="Forwarders" />
        )}
        {cardType === 'IMPORTER' && (
          <FormattedMessage id="components.NavBar.Filter.importers" defaultMessage="Importers" />
        )}
        {cardType === 'PARTNER' && (
          <FormattedMessage id="modules.Projects.sharedPartners" defaultMessage="Shared Partners" />
        )}
      </div>
      <BaseButton
        icon="IMPORTERS"
        disabled={readOnly}
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

ViewMoreCard.defaultProps = defaultProps;

export default ViewMoreCard;
