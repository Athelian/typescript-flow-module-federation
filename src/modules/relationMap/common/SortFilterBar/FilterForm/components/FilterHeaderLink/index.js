// @flow
import * as React from 'react';
import { FilterHeaderLinkStyle, DisabledStyle } from './style';

type OptionalProps = {
  disabled: boolean,
  active: boolean,
  onClick: Function,
  children: React.Node,
};

type Props = OptionalProps & {
  label: string | React.Node,
};

const defaultProps = {
  disabled: false,
  active: false,
  onClick: () => {},
  children: null,
};

const FilterHeaderLink = ({ label, disabled, active, onClick, children }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={disabled ? DisabledStyle : FilterHeaderLinkStyle(active)}
  >
    {label}
    {children}
  </button>
);

FilterHeaderLink.defaultProps = defaultProps;

export default FilterHeaderLink;
