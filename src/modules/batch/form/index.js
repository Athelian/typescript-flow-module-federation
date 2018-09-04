// @flow
import * as React from 'react';
import logger from 'utils/logger';
import Icon from 'components/Icon';
import { Tooltip, SectionHeader, LastModified } from 'components/Form';
import BatchSection from './components/BatchSection';
import { BatchFormWrapperStyle, SectionWrapperStyle, StatusStyle } from './style';

type Props = {
  batch: Object,
};

export default function BatchForm({ batch }: Props) {
  const isNew = Object.keys(batch).length === 0;
  logger.warn('batch', batch);

  return (
    <div className={BatchFormWrapperStyle}>
      <div className={SectionWrapperStyle} id="batchSection">
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
        <BatchSection isNew={isNew} initialValues={{ ...batch }} />
      </div>
    </div>
  );
}
