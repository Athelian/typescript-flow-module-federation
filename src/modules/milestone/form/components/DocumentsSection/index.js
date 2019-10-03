// @flow
import React from 'react';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { MilestoneFilesContainer } from 'modules/milestone/form/containers';
import {
  MILESTONE_SET_DOCUMENTS,
  MILESTONE_DOCUMENT_DELETE,
  MILESTONE_DOCUMENT_CREATE,
  MILESTONE_DOCUMENT_SET_STATUS,
  MILESTONE_DOCUMENT_SET_TYPE,
  MILESTONE_DOCUMENT_SET_MEMO,
  MILESTONE_DOCUMENTS_DOWNLOAD,
} from 'modules/permission/constants/milestone';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_STATUS,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
} from 'modules/permission/constants/file';
import DocumentsSection from 'sections/DocumentsSection';

export default function MilestoneDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(MILESTONE_SET_DOCUMENTS);
  const canRemove = canSetDocuments || hasPermission([MILESTONE_DOCUMENT_DELETE, DOCUMENT_DELETE]);
  const canUpload = canSetDocuments || hasPermission([MILESTONE_DOCUMENT_CREATE, DOCUMENT_CREATE]);
  const canUpdateStatus =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_STATUS, MILESTONE_DOCUMENT_SET_STATUS, DOCUMENT_UPDATE]);
  const canUpdateType =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_TYPE, MILESTONE_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]);

  const canUpdateMemo =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_MEMO, MILESTONE_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]);
  const canDownload = hasPermission(MILESTONE_DOCUMENTS_DOWNLOAD);

  return (
    <DocumentsSection
      entityType="Milestone"
      container={MilestoneFilesContainer}
      canUpload={canUpload}
      canDownload={canDownload}
      canRemove={canRemove}
      canUpdateStatus={canUpdateStatus}
      canUpdateType={canUpdateType}
      canUpdateMemo={canUpdateMemo}
    />
  );
}
