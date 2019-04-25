// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { DocumentsInput, SectionWrapper, SectionHeader } from 'components/Form';
import { OrderItemContainer } from 'modules/orderItem/form/containers';
import FormattedNumber from 'components/FormattedNumber';

const messages = defineMessages({
  document: {
    id: 'global.upload.types.item.document',
    defaultMessage: 'Document',
  },
});

type Props = {
  intl: IntlShape,
};

function DocumentsSection({ intl }: Props) {
  return (
    <SectionWrapper id="orderItem_documentsSection">
      <Subscribe to={[OrderItemContainer]}>
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
              editable
              downloadable
              values={files}
              onChange={(field, value) => {
                changeFiles(field, value);
              }}
              types={[
                {
                  value: 'Document',
                  label: intl.formatMessage(messages.document),
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
