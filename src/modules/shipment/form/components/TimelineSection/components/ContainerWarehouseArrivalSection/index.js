// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { isNullOrUndefined } from 'utils/fp';
import { earliest, latest } from 'utils/date';
import GridColumn from 'components/GridColumn';
import { SectionHeader } from 'components/Form';
import { EditButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import {
  ContainersAmountSummary,
  ContainersDatesSummary,
} from 'modules/shipment/form/components/ContainersSummary';
import { ContainersSlideView } from 'modules/shipment/form/components';
import { ContainerWarehouseArrivalSectionWrapperStyle } from './style';

type OptionalProps = {
  containers: Array<Object>,
};

type Props = OptionalProps & {};

const defaultProps = {
  containers: [],
};

class ContainerWarehouseArrivalSection extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { containers, ...rest } = this.props;

    const agreedArrivalDates = containers
      .map(({ warehouseArrivalAgreedDate }) => warehouseArrivalAgreedDate)
      .filter(item => !isNullOrUndefined(item))
      .map(item => new Date(item));

    const actualArrivalDates = containers
      .map(({ warehouseArrivalActualDate }) => warehouseArrivalActualDate)
      .filter(item => !isNullOrUndefined(item))
      .map(item => new Date(item));

    const agreedArrivalDateFrom = earliest(agreedArrivalDates);
    const agreedArrivalDateTo = latest(agreedArrivalDates);
    const actualArrivalDateFrom = earliest(actualArrivalDates);
    const actualArrivalDateTo = latest(actualArrivalDates);
    const numOfContainers = containers.length;
    const numOfApprovedAgreed = agreedArrivalDates.length;
    const numOfApprovedActual = actualArrivalDates.length;

    return (
      <div className={ContainerWarehouseArrivalSectionWrapperStyle} {...rest}>
        <GridColumn>
          <SectionHeader
            icon="WAREHOUSE"
            title={
              <FormattedMessage
                id="modules.Shipments.warehouseArrival"
                defaultMessage="WAREHOUSE ARRIVAL"
              />
            }
          >
            <BooleanValue>
              {({ value: isOpen, set: slideToggle }) => (
                <>
                  <EditButton
                    label={
                      <FormattedMessage
                        id="modules.Shipments.editDates"
                        defaultMessage="EDIT DATES"
                      />
                    }
                    onClick={() => slideToggle(true)}
                  />
                  <SlideView
                    isOpen={isOpen}
                    onRequestClose={() => slideToggle(false)}
                    options={{ width: '1030px' }}
                  >
                    {isOpen && (
                      <ContainersSlideView
                        containers={containers}
                        agreedArrivalDateFrom={agreedArrivalDateFrom}
                        agreedArrivalDateTo={agreedArrivalDateTo}
                        actualArrivalDateFrom={actualArrivalDateFrom}
                        actualArrivalDateTo={actualArrivalDateTo}
                        numOfContainers={numOfContainers}
                        numOfApprovedAgreed={numOfApprovedAgreed}
                        numOfApprovedActual={numOfApprovedActual}
                        onCancel={() => slideToggle(false)}
                        onSave={() => slideToggle(false)}
                      />
                    )}
                  </SlideView>
                </>
              )}
            </BooleanValue>
          </SectionHeader>
          <ContainersDatesSummary
            agreedArrivalDateFrom={agreedArrivalDateFrom}
            agreedArrivalDateTo={agreedArrivalDateTo}
            actualArrivalDateFrom={actualArrivalDateFrom}
            actualArrivalDateTo={actualArrivalDateTo}
          />
          <ContainersAmountSummary
            numOfContainers={numOfContainers}
            numOfApprovedAgreed={numOfApprovedAgreed}
            numOfApprovedActual={numOfApprovedActual}
          />
        </GridColumn>
      </div>
    );
  }
}

export default ContainerWarehouseArrivalSection;
