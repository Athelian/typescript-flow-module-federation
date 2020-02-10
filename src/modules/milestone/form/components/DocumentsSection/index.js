// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { MilestoneFilesContainer } from 'modules/milestone/form/containers';
import {
  MILESTONE_UPDATE,
  MILESTONE_SET_DOCUMENTS,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_DOCUMENT_CREATE,
  MILESTONE_DOCUMENT_SET_TYPE,
  MILESTONE_DOWNLOAD_DOCUMENTS,
} from 'modules/permission/constants/milestone';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';

export default function MilestoneDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canUpload = hasPermission([
    MILESTONE_SET_DOCUMENTS,
    MILESTONE_DOCUMENT_CREATE,
    DOCUMENT_CREATE,
  ]);
  const canAddOrphan = hasPermission([MILESTONE_SET_DOCUMENTS, MILESTONE_UPDATE]);
  const canViewForm = hasPermission(DOCUMENT_FORM);
  const canDownload = hasPermission(MILESTONE_DOWNLOAD_DOCUMENTS);
  const canChangeType = hasPermission([
    MILESTONE_SET_DOCUMENTS,
    DOCUMENT_SET_TYPE,
    MILESTONE_DOCUMENT_SET_TYPE,
    DOCUMENT_UPDATE,
  ]);
  const canDelete = hasPermission([
    MILESTONE_SET_DOCUMENTS,
    MILESTONE_DOCUMENT_DELETE,
    DOCUMENT_DELETE,
  ]);

  return (
    <Subscribe to={[MilestoneFilesContainer]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <SectionWrapper id="milestone_documentsSection">
            <DocumentsUpload
              files={files}
              entity="Milestone"
              onSave={updateFiles => setFieldValue('files', updateFiles)}
              canUpload={canUpload}
              canAddOrphan={canAddOrphan}
              canViewForm={canViewForm}
              canDownload={canDownload}
              canChangeType={canChangeType}
              canDelete={canDelete}
            />
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
}
