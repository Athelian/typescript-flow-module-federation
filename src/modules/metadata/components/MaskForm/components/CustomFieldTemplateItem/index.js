// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Display, Label } from 'components/Form';
import Icon from 'components/Icon';
import { CustomFieldTemplateItemWrapperStyle, CheckBoxStyle } from './style';

type OptionalProps = {
  checked: boolean,
  onClick: Function,
  editable: boolean,
};

type Props = OptionalProps & {
  item: {
    id: string,
    name: string,
  },
};

const defaultProps = {
  checked: false,
  onClick: () => {},
  editable: true,
};

const CustomFieldTemplateItem = ({ checked, item: { name }, onClick, editable }: Props) => (
  <div
    className={CustomFieldTemplateItemWrapperStyle(checked, editable)}
    onClick={editable ? onClick : () => {}}
    role="presentation"
  >
    <button className={CheckBoxStyle(editable)} type="button">
      <Icon icon="CHECKED_SQUARE" />
    </button>

    <Label width="200px" height="30px">
      {name}
    </Label>

    <Display width="200px" height="30px" color="GRAY_LIGHT" style={{ userSelect: 'none' }}>
      <FormattedMessage
        id="components.inputs.customFieldDefinitionPlaceholder"
        defaultMessage="Value will be entered here"
      />
    </Display>
  </div>
);

CustomFieldTemplateItem.defaultProps = defaultProps;

export default CustomFieldTemplateItem;
