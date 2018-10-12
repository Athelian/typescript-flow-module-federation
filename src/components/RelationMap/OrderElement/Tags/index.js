// @flow
import React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import * as style from './style';

const MAX_TAGS_NO = 4;

type Props = {
  dataSource: Array<Object>,
};
const Tags = ({ dataSource }: Props) => {
  if (!dataSource || dataSource.length === 0) {
    return null;
  }

  return (
    <div className={style.TagsWrapperStyle}>
      {dataSource.slice(0, MAX_TAGS_NO).map(tag => (
        <div key={tag.id} className={style.TagLabelStyle(tag.color)}>
          {tag.name}
        </div>
      ))}
      {dataSource.length > MAX_TAGS_NO && (
        <div className={style.MoreTags}>
          + <FormattedNumber value={dataSource.length - MAX_TAGS_NO} />
        </div>
      )}
    </div>
  );
};

export default Tags;
