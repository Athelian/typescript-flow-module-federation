// @flow
import * as React from 'react';
import { FilterSectionButtonStyle, DisabledStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  active: boolean,
  onClick: Function,
};

type Props = OptionalProps & {
  label: string | React.Node,
};

const defaultProps = {
  disabled: false,
  active: false,
  onClick: () => {},
};

const FilterSectionButton = ({ label, disabled, active, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={disabled ? DisabledStyle : FilterSectionButtonStyle(active)}
  >
    {label}
  </button>
);

FilterSectionButton.defaultProps = defaultProps;

export default FilterSectionButton;
