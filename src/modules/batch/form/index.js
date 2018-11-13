// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import BatchFormContainer from 'modules/batch/form/container';
import Icon from 'components/Icon';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
import { Tooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import { SyncButton, CloneButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import {
  BatchSection,
  OrderSection,
  QuantityAdjustmentsSection,
  PackagingSection,
  ShipmentSection,
} from './components';
import { BatchFormWrapperStyle, StatusStyle, StatusLabelStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  isClone: boolean,
  selectable: boolean,
  onFormReady: () => void,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  isNew: false,
  isClone: false,
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

  onClone = () => {
    const { batch } = this.props;
    navigate(`/batch/clone/${encodeId(batch.id)}`);
  };

  render() {
    const { batch, isNew, isClone, selectable } = this.props;
    return (
      <div className={BatchFormWrapperStyle}>
        <SectionWrapper id="batchSection">
          <SectionHeader
            icon="BATCH"
            title={<FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />}
          >
            {!isNew && (
              <>
                <LastModified updatedAt={batch.updatedAt} updatedBy={batch.updatedBy} />
                {!isClone && <CloneButton onClick={this.onClone} />}
                <div className={StatusStyle(batch.archived)}>
                  <Icon icon={batch.archived ? 'ARCHIVED' : 'ACTIVE'} />
                  <div className={StatusLabelStyle}>
                    {batch.archived ? (
                      <FormattedMessage id="modules.Batches.archived" defaultMessage="Archived" />
                    ) : (
                      <FormattedMessage id="modules.Batches.active" defaultMessage="Active" />
                    )}
                  </div>
                  <Tooltip
                    infoMessage={
                      <FormattedMessage
                        id="modules.Batches.archived.tooltip.infoMessage"
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
                id="modules.Batches.quantityAdjustments"
                defaultMessage="QUANTITY ADJUSTMENTS"
              />
            }
          />
          <QuantityAdjustmentsSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="packagingSection">
          <SectionHeader
            icon="PACKAGING"
            title={<FormattedMessage id="modules.Batches.packaging" defaultMessage="PACKAGING" />}
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
                              id="modules.Batches.syncPackagingMessage"
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
            title={<FormattedMessage id="modules.Batches.shipment" defaultMessage="SHIPMENT" />}
          />
          <ShipmentSection shipment={batch.shipment} />
        </SectionWrapper>

        <SectionWrapper id="orderSection">
          <SectionHeader
            icon="ORDER"
            title={<FormattedMessage id="modules.Batches.order" defaultMessage="ORDER" />}
          />
          <Subscribe to={[BatchFormContainer]}>
            {({ state: { orderItem } }) => <OrderSection order={orderItem && orderItem.order} />}
          </Subscribe>
        </SectionWrapper>
      </div>
    );
  }
}
