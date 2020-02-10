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
  MILESTONE_DOCUMENT_SET_TAGS,
  MILESTONE_DOCUMENT_SET_TYPE,
  MILESTONE_DOCUMENT_SET_MEMO,
  MILESTONE_DOCUMENTS_DOWNLOAD,
} from 'modules/permission/constants/milestone';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_TAGS,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';

export default function MilestoneDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(MILESTONE_SET_DOCUMENTS);

  const canRemove = canSetDocuments || hasPermission([MILESTONE_DOCUMENT_DELETE, DOCUMENT_DELETE]);

  const canUpload = canSetDocuments || hasPermission([MILESTONE_DOCUMENT_CREATE, DOCUMENT_CREATE]);

  const canAdd = canSetDocuments || hasPermission([MILESTONE_UPDATE]);

  const canUpdateTags =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_TAGS, MILESTONE_DOCUMENT_SET_TAGS, DOCUMENT_UPDATE]);

  const canUpdateType =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_TYPE, MILESTONE_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]);

  const canUpdateMemo =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_MEMO, MILESTONE_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]);

  const canDownload = hasPermission(MILESTONE_DOCUMENTS_DOWNLOAD);

  const canViewForm = hasPermission(DOCUMENT_FORM);

  return (
    <Subscribe to={[MilestoneFilesContainer]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <SectionWrapper id="milestone_documentsSection">
            <DocumentsUpload
              entity="Milestone"
              files={files}
              removable={canRemove}
              uploadable={canUpload}
              addable={canAdd}
              editable={{
                status: canUpdateStatus,
                type: canUpdateType,
                memo: canUpdateMemo,
              }}
              downloadable={canDownload}
              viewForm={canViewForm}
              onSave={updateFiles => setFieldValue('files', updateFiles)}
            />
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
}
