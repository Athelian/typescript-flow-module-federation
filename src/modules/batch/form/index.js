// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import BatchFormContainer from 'modules/batch/form/container';
import { BooleanValue } from 'react-values';
import Icon from 'components/Icon';
import { isEquals } from 'utils/fp';
import { Tooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import { SyncButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import {
  BatchSection,
  OrderSection,
  QuantityAdjustmentsSection,
  PackagingSection,
  ShipmentSection,
} from './components';
import { BatchFormWrapperStyle, StatusStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  selectable: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  isNew: false,
  selectable: true,
  onFormReady: () => {},
};

export default class BatchForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onFormReady } = this.props;

    if (onFormReady) onFormReady();
  }

  shouldComponentUpdate(nextProps: Props) {
    const { batch, selectable, isNew } = this.props;

    return (
      !isEquals(batch, nextProps.batch) ||
      !isEquals(selectable, nextProps.selectable) ||
      !isEquals(isNew, nextProps.isNew)
    );
  }

  render() {
    const { batch, isNew, selectable } = this.props;
    return (
      <div className={BatchFormWrapperStyle}>
        <SectionWrapper id="batchSection">
          <SectionHeader
            icon="BATCH"
            title={<FormattedMessage id="modules.batch.batch" defaultMessage="BATCH" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={batch.updatedAt} updatedBy={batch.updatedBy} />

                <div className={StatusStyle(batch.archived)}>
                  <Icon icon={batch.archived ? 'ARCHIVED' : 'ACTIVE'} />
                  {batch.archived ? (
                    <FormattedMessage id="modules.batch.archived" defaultMessage="Archived" />
                  ) : (
                    <FormattedMessage id="modules.batch.active" defaultMessage="Active" />
                  )}
                  <Tooltip
                    infoMessage={
                      <FormattedMessage
                        id="modules.batch.archived.tooltip.infoMessage"
                        defaultMessage="The status is controlled by the Order and Shipment this Batch belongs to"
                      />
                    }
                    position="bottom"
                  />
                </div>
              </>
            )}
          </SectionHeader>
          <BatchSection isNew={isNew} selectable={selectable} />
        </SectionWrapper>

        <SectionWrapper id="quantityAdjustmentsSection">
          <SectionHeader
            icon="QUANTITY_ADJUSTMENTS"
            title={
              <FormattedMessage
                id="modules.batch.quantityAdjustments"
                defaultMessage="QUANTITY ADJUSTMENTS"
              />
            }
          />
          <QuantityAdjustmentsSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="packagingSection">
          <SectionHeader
            icon="PACKAGING"
            title={<FormattedMessage id="modules.batch.packaging" defaultMessage="PACKAGING" />}
          >
            <BooleanValue>
              {({ value: syncDialogIsOpen, set: dialogToggle }) => (
                <>
                  <SyncButton onClick={() => dialogToggle(true)} />
                  <Subscribe to={[BatchFormContainer]}>
                    {({ state, syncProductProvider }) => (
                      <>
                        <ConfirmDialog
                          isOpen={syncDialogIsOpen}
                          onRequestClose={() => dialogToggle(false)}
                          onCancel={() => dialogToggle(false)}
                          onConfirm={() => {
                            if (state.orderItem && state.orderItem.productProvider) {
                              syncProductProvider(
                                state.orderItem && state.orderItem.productProvider
                              );
                            }
                            dialogToggle(false);
                          }}
                          message={
                            <FormattedMessage
                              id="modules.batch.syncPackagingMessage"
                              defaultMessage="Are you sure sync the packaging?"
                            />
                          }
                          width={400}
                        />
                      </>
                    )}
                  </Subscribe>
                </>
              )}
            </BooleanValue>
          </SectionHeader>
          <PackagingSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="shipmentSection">
          <SectionHeader
            icon="SHIPMENT"
            title={<FormattedMessage id="modules.batch.shipment" defaultMessage="SHIPMENT" />}
          />
          <ShipmentSection shipment={batch.shipment} />
        </SectionWrapper>

        <SectionWrapper id="orderSection">
          <SectionHeader
            icon="ORDER"
            title={<FormattedMessage id="modules.batch.order" defaultMessage="ORDER" />}
          />
          <Subscribe to={[BatchFormContainer]}>
            {({ state: { orderItem } }) => <OrderSection order={orderItem && orderItem.order} />}
          </Subscribe>
        </SectionWrapper>
      </div>
    );
  }
}
