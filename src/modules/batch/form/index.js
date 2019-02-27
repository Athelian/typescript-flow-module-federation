// @flow
import React, { lazy, Suspense } from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { isEquals } from 'utils/fp';
import { encodeId } from 'utils/id';
import { FormTooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import { CloneButton } from 'components/Buttons';
import { PermissionConsumer } from 'modules/permission';
import { BATCH_CREATE } from 'modules/permission/constants/batch';
import {
  BatchSection,
  QuantityAdjustmentsSection,
  ShipmentSection,
  ContainerSection,
} from './components';
import { BatchFormWrapperStyle, StatusStyle, StatusLabelStyle } from './style';

const AsyncPackagingSection = lazy(() => import('./components/PackagingSection'));
const AsyncOrderSection = lazy(() => import('./components/OrderSection'));

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
      <Suspense fallback={<LoadingIcon />}>
        <PermissionConsumer>
          {hasPermission => (
            <div className={BatchFormWrapperStyle}>
              <SectionWrapper id="batch_batchSection">
                <SectionHeader
                  icon="BATCH"
                  title={<FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />}
                >
                  {!isNew && (
                    <>
                      <LastModified updatedAt={batch.updatedAt} updatedBy={batch.updatedBy} />
                      {!isClone && hasPermission(BATCH_CREATE) && (
                        <CloneButton onClick={this.onClone} />
                      )}
                      <div className={StatusStyle(batch.archived)}>
                        <Icon icon={batch.archived ? 'ARCHIVED' : 'ACTIVE'} />
                        <div className={StatusLabelStyle}>
                          {batch.archived ? (
                            <FormattedMessage
                              id="modules.Batches.archived"
                              defaultMessage="Archived"
                            />
                          ) : (
                            <FormattedMessage id="modules.Batches.active" defaultMessage="Active" />
                          )}
                        </div>
                        <FormTooltip
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

              <SectionWrapper id="batch_quantityAdjustmentsSection">
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
              <AsyncPackagingSection isNew={isNew} />

              <SectionWrapper id="batch_shipmentSection">
                <SectionHeader
                  icon="SHIPMENT"
                  title={
                    <FormattedMessage id="modules.Batches.shipment" defaultMessage="SHIPMENT" />
                  }
                />
                <ShipmentSection shipment={batch.shipment} />
              </SectionWrapper>

              <SectionWrapper id="batch_containerSection">
                <SectionHeader
                  icon="CONTAINER"
                  title={
                    <FormattedMessage id="modules.Batches.container" defaultMessage="CONTAINER" />
                  }
                />
                <ContainerSection container={batch.container} />
              </SectionWrapper>

              <AsyncOrderSection />
            </div>
          )}
        </PermissionConsumer>
      </Suspense>
    );
  }
}
