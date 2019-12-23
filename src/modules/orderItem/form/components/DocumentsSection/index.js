// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { DocumentsUpload, SectionWrapper, SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_DOWNLOAD_DOCUMENTS,
  ORDER_ITEMS_DOCUMENT_DELETE,
  ORDER_ITEMS_DOCUMENT_CREATE,
  ORDER_ITEMS_DOCUMENT_SET_MEMO,
  ORDER_ITEMS_DOCUMENT_SET_STATUS,
  ORDER_ITEMS_DOCUMENT_SET_TYPE,
} from 'modules/permission/constants/orderItem';
import {
  DOCUMENT_CREATE,
  DOCUMENT_DELETE,
  DOCUMENT_SET_MEMO,
  DOCUMENT_SET_STATUS,
  DOCUMENT_SET_TYPE,
  DOCUMENT_UPDATE,
  DOCUMENT_FORM,
} from 'modules/permission/constants/file';
import { OrderItemFilesContainer } from 'modules/orderItem/form/containers';

function ItemDocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(ORDER_ITEMS_SET_DOCUMENTS);

  const canRemove =
    canSetDocuments || hasPermission([ORDER_ITEMS_DOCUMENT_DELETE, DOCUMENT_DELETE]);

  const canUpload =
    canSetDocuments || hasPermission([ORDER_ITEMS_DOCUMENT_CREATE, DOCUMENT_CREATE]);

  const canAdd = canSetDocuments || hasPermission([ORDER_ITEMS_UPDATE]);

  const canUpdateStatus =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_STATUS, ORDER_ITEMS_DOCUMENT_SET_STATUS, DOCUMENT_UPDATE]);

  const canUpdateType =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_TYPE, ORDER_ITEMS_DOCUMENT_SET_TYPE, DOCUMENT_UPDATE]);

  const canUpdateMemo =
    canSetDocuments ||
    hasPermission([DOCUMENT_SET_MEMO, ORDER_ITEMS_DOCUMENT_SET_MEMO, DOCUMENT_UPDATE]);

  const canDownload = hasPermission(ORDER_ITEMS_DOWNLOAD_DOCUMENTS);

  const canViewForm = hasPermission(DOCUMENT_FORM);

  return (
    <Subscribe to={[OrderItemFilesContainer]}>
      {({ state: { files = [] }, setFieldValue }) => {
        return (
          <div>
            <SectionWrapper id="orderItem_documentsSection">
              <SectionHeader
                icon="DOCUMENT"
                title={
                  <>
                    <FormattedMessage
                      id="modules.OrderItems.documents"
                      defaultMessage="Documents"
                    />{' '}
                    (<FormattedNumber value={files.length} />)
                  </>
                }
              />
              <DocumentsUpload
                entity="OrderItem"
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
          </div>
        );
      }}
    </Subscribe>
  );
}

export default ItemDocumentsSection;
