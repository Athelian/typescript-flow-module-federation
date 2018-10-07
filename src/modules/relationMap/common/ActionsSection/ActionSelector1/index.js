// @flow
import * as React from 'react';
import * as style from '../style';

type Props = {
  children: React.Node,
  directive: string,
  target: string,
  targetNo: number,
};

const ActionsSection1 = ({ children, directive, target, targetNo }: Props) => (
  <div className={style.ActionSection1WrapperStyle}>
    <div className={style.ActionsSelectedStyle}>
      <div>{directive}</div>
      <div>
        {targetNo} {target}
      </div>
    </div>
    <div className={style.ChildrenWrapperStyle}>{children}</div>
  </div>
);

export default ActionsSection1;
