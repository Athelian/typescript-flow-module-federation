// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import { FieldItem, Label } from 'components/Form';
import { ShowAllButtonStyle, MetadataIconStyle } from './style';

type Props = {
  customFields: {
    mask: Object,
    fieldValues: Array<Object>,
    fieldDefinitions: Array<Object>,
  },
};

const metadataInputFactory = ({ customFields }: Props) => (
  <FieldItem
    label={
      <Label>
        <FormattedMessage id="modules.form.customFields" defaultMessage="CUSTOM FIELDS" />
        {' ('}
        <FormattedNumber value={customFields.fieldValues.length} />
        {')'}
      </Label>
    }
    tooltip={
      <div className={MetadataIconStyle}>
        <Icon icon="METADATA" />
      </div>
    }
    input={
      <button
        onClick={() => console.log(customFields)}
        className={ShowAllButtonStyle}
        type="button"
      >
        <FormattedMessage id="modules.form.showAll" defaultMessage="Show All" />
      </button>
    }
  />
);

export default metadataInputFactory;
