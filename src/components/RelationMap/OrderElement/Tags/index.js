// @flow
import React from 'react';
import * as style from './style';

type Props = {
  dataSource: Array<Object>,
};
const Tags = ({ dataSource }: Props) => {
  if (!dataSource || dataSource.length === 0) {
    return null;
  }
  return (
    <div className={style.TagsWrapperStyle}>
      {dataSource.map(tag => (
        <div key={tag.id} className={style.TagLabelStyle(tag.color)}>
          {tag.name}
        </div>
      ))}
    </div>
  );
};

export default Tags;
