// @flow
import * as React from 'react';
import { Link } from '@reach/router';
import { type Tag as TagType } from 'modules/tags/type.js.flow';
import { encodeId } from 'utils/id';
import Tag from 'components/Tag';
import Icon from 'components/Icon';
import BaseCard from '../BaseCard';
import {
  TagCardWrapperStyle,
  TagWrapperStyle,
  TagDescriptionWrapperStyle,
  TagDescriptionFadeStyle,
  TagTypesWrapperStyle,
  TagTypeStyle,
} from './style';

type OptionalProps = {
  actions: Array<React.Node>,
};

type Props = OptionalProps & {
  tag: ?TagType,
};

const defaultProps = {
  actions: [],
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

const TagCard = ({ tag, actions, ...rest }: Props) => {
  if (!tag) return '';

  const { description, entityTypes } = tag;

  return (
    <BaseCard icon="TAG" color="TAG" actions={actions} {...rest}>
      <Link className={TagCardWrapperStyle} to={`/tags/${encodeId(tag.id)}`}>
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
