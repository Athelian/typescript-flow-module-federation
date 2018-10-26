// @flow
import * as React from 'react';
import * as style from '../style';

type OptionalProps = {
  target: string,
  targetNo: string,
};

type Props = OptionalProps & {
  children: React.Node,
  directive: string,
};

const defaultProps = {
  target: '',
  targetNo: '',
};

const ActionsSectionPrimary = ({ children, directive, target, targetNo }: Props) => (
  <div className={style.ActionSection1WrapperStyle}>
    <div className={style.ActionsSelectedStyle}>
      <div>{directive}</div>
      {target && (
        <div>
          {targetNo} {target}
        </div>
      )}
    </div>
    <div className={style.ActionButtonWrapperStyle}>{children}</div>
  </div>
);

ActionsSectionPrimary.defaultProps = defaultProps;

export default ActionsSectionPrimary;
