// @flow
import * as React from 'react';
import { FormattedTime } from 'react-intl';
import UserAvatar from 'components/UserAvatar';
import type { UserInfo } from '../User';
import { ContentStyle, CommentWrapperStyle, TimeStyle, ContentFigureStyle } from './style';

export type CommentItem = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: UserInfo,
  content: string,
};

type Props = {
  comment: CommentItem,
};

const Comment = ({ comment }: Props) => {
  return (
    <div className={CommentWrapperStyle}>
      <span className={TimeStyle}>
        <FormattedTime value={comment.createdAt} />
      </span>

      <div className={ContentStyle}>{comment.content}</div>

      <div className={ContentFigureStyle} />

      <UserAvatar
        width="30px"
        height="30px"
        firstName={comment.createdBy.firstName}
        lastName={comment.createdBy.lastName}
        image={comment.createdBy.avatar ? comment.createdBy.avatar.path : null}
      />
    </div>
  );
};

export default Comment;
