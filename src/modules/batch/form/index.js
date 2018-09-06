// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { Tooltip, SectionHeader, LastModified, SectionWrapper } from 'components/Form';
import BatchSection from './components/BatchSection';
import PackagingSection from './components/PackagingSection';
import { BatchFormWrapperStyle, StatusStyle } from './style';

type OptionalProps = {
  isNew: boolean,
};

type Props = OptionalProps & {
  batch: Object,
};

const defaultProps = {
  isNew: false,
};

const BatchForm = ({ batch, isNew }: Props) => (
  <div className={BatchFormWrapperStyle}>
    <SectionWrapper id="batchSection">
      <SectionHeader icon="BATCH" title="BATCH">
        {!isNew && (
          <>
            <LastModified updatedAt={batch.updatedAt} />

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
      <BatchSection isNew={isNew} />
    </SectionWrapper>

    <SectionWrapper id="packagingSection">
      <SectionHeader icon="PACKAGING" title="PACKAGING" />
      <PackagingSection isNew={isNew} />
    </SectionWrapper>
  </div>
);

BatchForm.defaultProps = defaultProps;

export default BatchForm;
