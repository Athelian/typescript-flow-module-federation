// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsInput, SectionWrapper, SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';

type Props = {
  sectionId: string,
  entityType: string,
  container: Object,
  canUpload: boolean,
  canDownload: boolean,
  canRemove: boolean,
  canUpdateType: boolean,
  canUpdateStatus: boolean,
  canUpdateMemo: boolean,
};

export default function DocumentsSection({
  sectionId,
  entityType,
  container,
  canUpload,
  canDownload,
  canRemove,
  canUpdateType,
  canUpdateStatus,
  canUpdateMemo,
}: Props) {
  return (
    <Subscribe to={[container]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <div>
            <SectionWrapper id={sectionId}>
              <SectionHeader
                icon="DOCUMENT"
                title={
                  <>
                    <FormattedMessage id="modules.OrderItems.document" defaultMessage="DOCUMENTS" />{' '}
                    (
                    <FormattedNumber value={files.length} />)
                  </>
                }
              />
              <DocumentsInput
                entity={entityType}
                files={files}
                removable={canRemove}
                uploadable={canUpload}
                editable={{
                  status: canUpdateStatus,
                  type: canUpdateType,
                  memo: canUpdateMemo,
                }}
                downloadable={canDownload}
                onSave={updateFiles => setFieldValue('files', updateFiles)}
              />
            </SectionWrapper>
          </div>
        );
      }}
    </Subscribe>
  );
}