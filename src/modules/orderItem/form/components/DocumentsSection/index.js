// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import {
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
} from 'modules/permission/constants/file';
import { DocumentsInput, SectionWrapper, SectionHeader } from 'components/Form';
import { OrderItemFilesContainer } from 'modules/orderItem/form/containers';
import FormattedNumber from 'components/FormattedNumber';

function DocumentsSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canSetDocuments = hasPermission(ORDER_ITEMS_SET_DOCUMENTS);

  return (
    <SectionWrapper id="orderItem_documentsSection">
      <Subscribe to={[OrderItemFilesContainer]}>
        {({ state: { files = [] }, setFieldValue }) => (
          <>
            <SectionHeader
              icon="DOCUMENT"
              title={
                <>
                  <FormattedMessage id="modules.OrderItems.document" defaultMessage="DOCUMENTS" /> (
                  <FormattedNumber value={files.length} />)
                </>
              }
            />
            <DocumentsInput
              removable={
                canSetDocuments || hasPermission([ORDER_ITEMS_DOCUMENT_DELETE, DOCUMENT_DELETE])
              }
              uploadable={
                canSetDocuments || hasPermission([ORDER_ITEMS_DOCUMENT_CREATE, DOCUMENT_CREATE])
              }
              editable={{
                status:
                  canSetDocuments ||
                  hasPermission([
                    DOCUMENT_SET_STATUS,
                    ORDER_ITEMS_DOCUMENT_SET_STATUS,
                    DOCUMENT_UPDATE,
                  ]),
                type:
                  canSetDocuments ||
                  hasPermission([
                    DOCUMENT_SET_TYPE,
                    ORDER_ITEMS_DOCUMENT_SET_TYPE,
                    DOCUMENT_UPDATE,
                  ]),
                memo:
                  canSetDocuments ||
                  hasPermission([
                    DOCUMENT_SET_MEMO,
                    ORDER_ITEMS_DOCUMENT_SET_MEMO,
                    DOCUMENT_UPDATE,
                  ]),
              }}
              downloadable={hasPermission(ORDER_ITEMS_DOWNLOAD_DOCUMENTS)}
              files={files}
              onSave={updateFiles => setFieldValue('files', updateFiles)}
              entity="OrderItem"
            />
          </>
        )}
      </Subscribe>
    </SectionWrapper>
  );
}

export default DocumentsSection;
