// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import usePermission from 'hooks/usePermission';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { DocumentsInput, SectionWrapper, SectionHeader } from 'components/Form';
import { OrderItemFilesContainer } from 'modules/orderItem/form/containers';
import FormattedNumber from 'components/FormattedNumber';
import messages from 'modules/orderItem/messages';

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  const { hasPermission } = usePermission();
  const allowUpdate = hasPermission(ORDER_ITEMS_UPDATE);

  return (
    <SectionWrapper id="orderItem_documentsSection">
      <Subscribe to={[OrderItemFilesContainer]}>
        {({ state: { files = [] }, setDeepFieldValue: changeFiles }) => (
          <>
            <SectionHeader
              icon="DOCUMENT"
              title={
                <>
                  <FormattedMessage id="modules.orderItem.document" defaultMessage="DOCUMENTS" /> (
                  <FormattedNumber value={files.length} />)
                </>
              }
            />
            <DocumentsInput
              id="files"
              name="files"
              editable={allowUpdate}
              downloadable
              values={files}
              onChange={(field, value) => {
                changeFiles(field, value);
              }}
              types={[
                {
                  value: 'Document',
                  label: intl.formatMessage(messages.fileTypeDocument),
                },
              ]}
            />
          </>
        )}
      </Subscribe>
    </SectionWrapper>
  );
}

export default injectIntl(DocumentsSection);
