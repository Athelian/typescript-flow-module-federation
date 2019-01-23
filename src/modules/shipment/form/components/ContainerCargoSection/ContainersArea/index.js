// @flow
import * as React from 'react';
import { injectIntl, type IntlShape, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { NewButton } from 'components/Buttons';
import { ShipmentContainersContainer } from 'modules/shipment/form/containers';
import { ShipmentContainerCard, CardAction } from 'components/Cards';
import Icon from 'components/Icon';
import messages from 'modules/shipment/messages';
import {
  ContainersWrapperStyle,
  ContainersNavbarWrapperStyle,
  ContainersBodyWrapperStyle,
  ContainersHeaderWrapperStyle,
  IconStyle,
  TitleStyle,
  ContainersGridStyle,
  ContainersFooterWrapperStyle,
} from './style';

type Props = {
  intl: IntlShape,
  selectedContainer: ?string,
};

function ContainersArea({ intl, selectedContainer }: Props) {
  return (
    <Subscribe to={[ShipmentContainersContainer]}>
      {({ state: { containers }, setFieldValue, setFieldArrayValue }) => (
        <div className={ContainersWrapperStyle}>
          <div className={ContainersNavbarWrapperStyle} />
          <div className={ContainersBodyWrapperStyle}>
            <div className={ContainersHeaderWrapperStyle}>
              <div className={IconStyle}>
                <Icon icon="CONTAINER" />
              </div>
              <div className={TitleStyle}>
                <FormattedMessage id="modules.Shipments.containers" defaultMessage="CONTAINERS" />
                {` (${containers.length})`}
              </div>
            </div>
            <div className={ContainersGridStyle}>
              {selectedContainer}
              {containers.map((container, position) => (
                <ShipmentContainerCard
                  key={container.id}
                  container={container}
                  saveOnBlur={updateContainer => {
                    setFieldArrayValue(position, updateContainer);
                  }}
                  // onClick={() => containerSlideToggle(true)}
                  actions={[
                    <CardAction
                      icon="REMOVE"
                      hoverColor="RED"
                      onClick={() => {
                        setFieldValue(
                          'containers',
                          containers.filter(({ id: containerId }) => container.id !== containerId)
                        );
                      }}
                    />,
                  ]}
                />
              ))}
            </div>
          </div>
          <div className={ContainersFooterWrapperStyle}>
            <NewButton label={intl.formatMessage(messages.newContainer)} onClick={() => {}} />
          </div>
        </div>
      )}
    </Subscribe>
  );
}

export default injectIntl(ContainersArea);
