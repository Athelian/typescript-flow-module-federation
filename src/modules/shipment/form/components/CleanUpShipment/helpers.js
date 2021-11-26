// @flow

import { getEntityRelatedOrganizations } from 'utils/entity';

// eslint-disable-next-line
export const getUpdatedTags = ({
  infoContainer,
  tagsContainer,
  newValue,
  field,
}: {
  infoContainer: Object,
  tagsContainer: Object,
  oldValue: any,
  field: string,
}) => {
  const newState = {
    ...infoContainer.state,
    [field]: newValue,
  };

  const organizationsInState = getEntityRelatedOrganizations({
    formState: newState,
  }).reduce((arr, orgId) => {
    // eslint-disable-next-line
    arr[orgId] = orgId;

    return arr;
  }, {});

  const updatedTags = tagsContainer.state.tags.filter(tag => {
    return organizationsInState[tag?.ownedBy?.id];
  });

  return updatedTags;
};
