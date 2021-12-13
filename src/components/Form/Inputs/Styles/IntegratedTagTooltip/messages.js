// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  totalShared: {
    id: 'components.NavBar.Filter.tags.tooltip',
    defaultMessage: 'Total {totalTags} tags from {totalOwners} owners',
    values: { totalTags: 0, totalOwners: 0 },
  },
});
