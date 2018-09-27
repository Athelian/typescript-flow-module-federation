// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { isEquals } from 'utils/fp';
import { Tooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import BatchSection from './components/BatchSection';
import QuantityAdjustmentsSection from './components/QuantityAdjustmentsSection';
import PackagingSection from './components/PackagingSection';
import { BatchFormWrapperStyle, StatusStyle } from './style';

type OptionalProps = {
  isNew: boolean,
  selectable: boolean,
  onDetailReady: () => void,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  isNew: false,
  selectable: true,
  onDetailReady: () => {},
};

export default class BatchForm extends React.Component<Props> {
  static defaultProps = defaultProps;

  componentDidMount() {
    const { onDetailReady } = this.props;

    if (onDetailReady) onDetailReady();
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
          <SectionHeader icon="BATCH" title="BATCH">
            {!isNew && (
              <>
                <LastModified updatedAt={batch.updatedAt} updatedBy={batch.updatedBy} />

                <div className={StatusStyle(batch.archived)}>
                  <Icon icon={batch.archived ? 'ARCHIVED' : 'ACTIVE'} />
                  {batch.archived ? 'Archived' : 'Active'}
                  <Tooltip
                    infoMessage="The status is controlled by the Order and Shipment this Batch belongs to"
                    position="bottom"
                  />
                </div>
              </>
            )}
          </SectionHeader>
          <BatchSection isNew={isNew} selectable={selectable} />
        </SectionWrapper>

        <SectionWrapper id="quantityAdjustmentsSection">
          <SectionHeader icon="QUANTITY_ADJUSTMENTS" title="QUANTITY ADJUSTMENTS" />
          <QuantityAdjustmentsSection isNew={isNew} />
        </SectionWrapper>

        <SectionWrapper id="packagingSection">
          <SectionHeader icon="PACKAGING" title="PACKAGING" />
          <PackagingSection isNew={isNew} />
        </SectionWrapper>
      </div>
    );
  }
}
