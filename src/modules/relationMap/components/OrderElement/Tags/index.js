// @flow
import React from 'react';
import * as style from './style';

type Props = {
  dataSource: Array<Object>,
};
const Tags = ({ dataSource }: Props) => (
  <div className={style.TagsWrapperStyle}>
    {dataSource &&
      dataSource.length &&
      dataSource.map(tag => <div className={style.TagLabelStyle(tag.color)}>{tag.name}</div>)}
  </div>
);

export default Tags;
