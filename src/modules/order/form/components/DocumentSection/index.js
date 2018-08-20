// @flow
import * as React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { Form } from 'components/Form';
import DocumentsInput from 'components/Form/DocumentsInput';
import messages from 'modules/order/messages';
import { WrapperStyle } from './style';

type Props = {
  initialValues: Object,
  intl: intlShape,
};

function DocumentSection({ intl, initialValues }: Props) {
  return (
    <Form initialValues={initialValues}>
      {({ values, setFieldValue }) => (
        <div className={WrapperStyle}>
          <DocumentsInput
            name="files"
            folder="order"
            value={values.files}
            onChange={setFieldValue}
            types={[
              { type: 'OrderSheet', label: intl.formatMessage(messages.orderSheet) },
              { type: 'Other', label: intl.formatMessage(messages.other) },
            ]}
          />
        </div>
      )}
    </Form>
  );
}

export default injectIntl(DocumentSection);
