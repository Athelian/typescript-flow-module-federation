// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label } from 'components/Form';
import { OriginWrapperStyle } from './style';
import messages from '../messages';
import { EnumArrayInput } from '..';

type Props = {
  values: Array<Object>,
  onChange: Function,
};

export default function Origin({ values, onChange }: Props) {
  return (
    <div className={OriginWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.origin} />
          </Label>
        }
        input={<EnumArrayInput enumType="Country" values={values} onChange={onChange} />}
      />
    </div>
  );
}
