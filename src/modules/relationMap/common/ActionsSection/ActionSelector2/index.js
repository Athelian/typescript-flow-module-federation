// @flow
import * as React from 'react';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';

import * as style from '../style';

type Props = {
  directive: string,
};

const ActionsSection1 = ({ directive }: Props) => (
  <div className={style.ActionSection2WrapperStyle}>
    <div className={style.ActionsSelectedStyle}>
      <div>{directive}</div>
    </div>
    <div className={style.ChildrenWrapperStyle}>
      <TabItem active label="BATCH" icon="BATCH" onClick={() => {}} />
      <TabItem active={false} label="ORDER" icon="ORDER" onClick={() => {}} />
      <TabItem active={false} label="SHIPMENT" icon="SHIPMENT" onClick={() => {}} />
    </div>
  </div>
);

export default ActionsSection1;
