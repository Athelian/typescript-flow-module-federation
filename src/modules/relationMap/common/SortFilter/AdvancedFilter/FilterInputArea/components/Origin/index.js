// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label } from 'components/Form';
import { OriginWrapperStyle } from './style';
import messages from '../messages';
import { EnumArrayInput } from '..';

type Props = {
  values: Array<string>,
};

export default function Origin({ values }: Props) {
  return (
    <div className={OriginWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.origin} />
          </Label>
        }
        input={<EnumArrayInput enumType="Country" values={values} />}
      />
    </div>
  );
}
