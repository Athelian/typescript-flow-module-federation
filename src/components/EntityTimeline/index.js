// @flow
/* eslint-disable react/default-props-match-prop-types */
import * as React from 'react';
import { Form } from 'components/Form';
import { Mutation } from 'react-apollo';
// $FlowFixMe flow not yet configured
import { getDayOfYear, isSameDay } from 'date-fns';
import type { Entry, Comment } from './type.js.flow';
import MessageInput from './components/MessageInput';
import CommentEntry from './components/CommentEntry';
import EventEntry from './components/EventEntry';
import DateDivider from './components/DateDivider';
import { createCommentMutation, deleteCommentMutation, updateCommentMutation } from './query';
import { WrapperStyle, TimelineStyle, FormWrapperStyle } from './style';

type Props = {
  entityId: string,
  entityType: string,
  timeline: Array<Entry>,
  onNewComment: Comment => void,
  onUpdateComment: Comment => void,
  onDeleteComment: string => void,
  translateField: string => any,
  formatValue: (string, string) => any,
  targetToIdentifier: Object => string | React.Node,
  onTargetClick: Object => void,
};

const EntityTimeline = ({
  entityId,
  entityType,
  timeline,
  onNewComment,
  onUpdateComment,
  onDeleteComment,
  translateField,
  formatValue,
  targetToIdentifier,
  onTargetClick,
}: Props) => {
  const dateDividerCache = [];

  return (
    <div className={WrapperStyle}>
      <div className={TimelineStyle}>
        {timeline.map((entry, index) => {
          const content =
            // eslint-disable-next-line no-underscore-dangle
            entry.__typename === 'Comment' ? (
              <Mutation
                key={entry.id}
                mutation={updateCommentMutation}
                onCompleted={({ updateComment }) => {
                  onUpdateComment(updateComment);
                }}
              >
                {updateComment => (
                  <Mutation
                    mutation={deleteCommentMutation}
                    onCompleted={({ deleteComment }) => {
                      onDeleteComment(deleteComment.id);
                    }}
                  >
                    {deleteComment => (
                      // $FlowFixMe here don't take any other type but Comment
                      <CommentEntry
                        comment={entry}
                        onDelete={() => {
                          deleteComment({ variables: { id: entry.id } });
                        }}
                        onUpdate={values =>
                          updateComment({ variables: { id: entry.id, input: values } })
                        }
                        hideAvatar={
                          index > 0 &&
                          // eslint-disable-next-line no-underscore-dangle
                          timeline[index - 1].__typename === 'Comment' &&
                          timeline[index - 1].user.id === entry.user.id &&
                          isSameDay(timeline[index - 1].createdAt, entry.createdAt)
                        }
                      />
                    )}
                  </Mutation>
                )}
              </Mutation>
            ) : (
              // $FlowFixMe
              <EventEntry
                key={entry.id}
                event={entry}
                entityType={entityType}
                translateField={translateField}
                formatValue={formatValue}
                targetToIdentifier={targetToIdentifier}
                onTargetClick={onTargetClick}
              />
            );
          if (
            !dateDividerCache.some(date => getDayOfYear(date) === getDayOfYear(entry.createdAt))
          ) {
            dateDividerCache.push(entry.createdAt);
            return (
              <React.Fragment key={getDayOfYear(entry.createdAt)}>
                <DateDivider date={entry.createdAt} />
                {content}
              </React.Fragment>
            );
          }
          return content;
        })}
      </div>
      <Mutation
        mutation={createCommentMutation}
        onCompleted={({ createComment }) => {
          onNewComment(createComment);
        }}
      >
        {createComment => (
          <Form
            isInitialValid={false}
            initialValues={{}}
            validate={values => (!values.body ? { body: true } : {})}
            onSubmit={values => {
              createComment({ variables: { entityId, entityType, input: values } }).then(() => {
                // resetForm()
                // @TODO: zenform onSubmit doesn't give you resetForm() here, only values are given back
                // https://github.com/shrynx/zenform/blob/9b91ebf415c50523b73b86cb6f1a28f8c87a5ebb/src/Form.js#L166
              });
            }}
          >
            {({
              values,
              handleSubmit,
              setFieldValue,
              resetForm,
              onBlur,
              isSubmitting,
              isInvalid,
            }) => (
              <div className={FormWrapperStyle}>
                <MessageInput
                  name="body"
                  value={values.body}
                  onChange={e => setFieldValue('body', e.target.value)}
                  onBlur={onBlur}
                  onSubmit={event => {
                    if (!isSubmitting && !isInvalid) {
                      handleSubmit(event);
                      resetForm();
                    }
                  }}
                />
              </div>
            )}
          </Form>
        )}
      </Mutation>
    </div>
  );
};

export default EntityTimeline;
