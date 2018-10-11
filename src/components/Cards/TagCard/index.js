// @flow
import React from 'react';
import { Link, navigate } from '@reach/router';
import { type Tag as TagType } from 'modules/tags/type.js.flow';
import { encodeId } from 'utils/id';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import BaseCard, { CardAction } from '../BaseCard';
import {
  TagCardWrapperStyle,
  TagWrapperStyle,
  TagDescriptionWrapperStyle,
  TagDescriptionFadeStyle,
  TagTypesWrapperStyle,
  TagTypeStyle,
} from './style';

type OptionalProps = {
  readOnly: boolean,
  onClick: Function,
};

type Props = OptionalProps & {
  tag: ?TagType,
};

const defaultProps = {
  readOnly: true,
  onClick: () => {},
};

const getEntityType = (entityType: ?string) => {
  if (entityType) {
    if (entityType === 'Product') return 'PRODUCT';
    if (entityType === 'Order') return 'ORDER';
    if (entityType === 'Batch') return 'BATCH';
    if (entityType === 'Shipment') return 'SHIPMENT';
    if (entityType === 'User') return 'STAFF';
  }
  return 'GRAY_VERY_LIGHT';
};

function onClone(tagId: string) {
  navigate(`/tags/clone/${encodeId(tagId)}`);
}

const TagCard = ({ tag, onClick, readOnly, ...rest }: Props) => {
  if (!tag) return '';

  const { description, entityTypes } = tag;

  const actions = readOnly
    ? [<CardAction icon="CLONE" hoverColor="BLUE" onClick={() => onClone(tag.id)} />]
    : [];

  return (
    <BaseCard icon="TAG" color="TAG" actions={actions} {...rest}>
      <Link className={TagCardWrapperStyle} to={`/tags/${encodeId(tag.id)}`} onClick={onClick}>
        <div className={TagWrapperStyle}>
          <Tag tag={tag} />
        </div>
        <div className={TagDescriptionWrapperStyle}>
          {description}
          <div className={TagDescriptionFadeStyle} />
        </div>
        <div className={TagTypesWrapperStyle}>
          <div
            className={TagTypeStyle(
              getEntityType(entityTypes.find(entityType => entityType === 'Product'))
            )}
          >
            <Icon icon="PRODUCT" />
          </div>
          <div
            className={TagTypeStyle(
              getEntityType(entityTypes.find(entityType => entityType === 'Order'))
            )}
          >
            <Icon icon="ORDER" />
          </div>
          <div
            className={TagTypeStyle(
              getEntityType(entityTypes.find(entityType => entityType === 'Batch'))
            )}
          >
            <Icon icon="BATCH" />
          </div>
          <div
            className={TagTypeStyle(
              getEntityType(entityTypes.find(entityType => entityType === 'Shipment'))
            )}
          >
            <Icon icon="SHIPMENT" />
          </div>
          <div
            className={TagTypeStyle(
              getEntityType(entityTypes.find(entityType => entityType === 'User'))
            )}
          >
            <Icon icon="STAFF" />
          </div>
        </div>
      </Link>
    </BaseCard>
  );
};

TagCard.defaultProps = defaultProps;

export default TagCard;
