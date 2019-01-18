// @flow
import * as React from 'react';

import { FormattedMessage } from 'react-intl';
// import { Subscribe } from 'unstated';
// import { BooleanValue } from 'react-values';
// import containerFormContainer from 'modules/container/form/container';
import Icon from 'components/Icon';
// import { isEquals } from 'utils/fp';
// import { encodeId } from 'utils/id';
import { FormTooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';

// import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import { ContainerSection, ShipmentSection } from './components';

import { FormWrapperStyle, StatusStyle, StatusLabelStyle } from './style';

type OptionalProps = {
  onFormReady: () => void,
};

type Props = OptionalProps & {
  container: Object,
};

const defaultProps = {
  onFormReady: () => {},
};

export default class containerForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  // shouldComponentUpdate(nextProps: Props) {
  //   const { container, selectable, isNew } = this.props;

  //   return (
  //     !isEquals(container, nextProps.container) ||
  //     !isEquals(selectable, nextProps.selectable) ||
  //     !isEquals(isNew, nextProps.isNew)
  //   );
  // }

  render() {
    const { container } = this.props;
    return (
      <div className={FormWrapperStyle}>
        <SectionWrapper id="ContainerSection">
          <SectionHeader
            icon="CONTAINER"
            title={<FormattedMessage id="modules.container.container" defaultMessage="CONTAINER" />}
          >
            <>
              <LastModified updatedAt={container.updatedAt} updatedBy={container.updatedBy} />

              <div className={StatusStyle(container.archived)}>
                <Icon icon={container.archived ? 'ARCHIVED' : 'ACTIVE'} />
                <div className={StatusLabelStyle}>
                  {container.archived ? (
                    <FormattedMessage id="modules.container.archived" defaultMessage="Archived" />
                  ) : (
                    <FormattedMessage id="modules.container.active" defaultMessage="Active" />
                  )}
                </div>
                <FormTooltip
                  infoMessage={
                    <FormattedMessage
                      id="modules.container.archived.tooltip.infoMessage"
                      defaultMessage="The status is the same as the Shipment's status"
                    />
                  }
                  position="bottom"
                />
              </div>
            </>
          </SectionHeader>
          <ContainerSection />
        </SectionWrapper>

        <SectionWrapper id="ShipmentSection">
          <SectionHeader
            icon="SHIPMENT"
            title={<FormattedMessage id="modules.container.shipment" defaultMessage="SHIPMENT" />}
          />
          <ShipmentSection shipment={container.shipment} />
        </SectionWrapper>
      </div>
    );
  }
}
