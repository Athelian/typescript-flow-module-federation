// @flow
import React from 'react';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper } from 'components/Form';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { MilestoneFilesContainer } from 'modules/milestone/form/containers';
import {
  MILESTONE_UPDATE,
  MILESTONE_DOCUMENT_EDIT,
  MILESTONE_DOCUMENT_DOWNLOAD,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_DOCUMENT_FORM,
} from 'modules/permission/constants/milestone';
import { PARENTLESS_DOCUMENT_UPLOAD } from 'modules/permission/constants/file';

export default function MilestoneDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const canUpload = hasPermission(PARENTLESS_DOCUMENT_UPLOAD);
  const canAddOrphan = hasPermission([MILESTONE_DOCUMENT_EDIT, MILESTONE_UPDATE]);
  const canChangeType = hasPermission([MILESTONE_DOCUMENT_EDIT, MILESTONE_UPDATE]);
  const canViewForm = hasPermission(MILESTONE_DOCUMENT_FORM);
  const canDownload = hasPermission(MILESTONE_DOCUMENT_DOWNLOAD);
  const canDelete = hasPermission(MILESTONE_DOCUMENT_DELETE);

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
