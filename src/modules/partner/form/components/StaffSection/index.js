// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import PartnerFormContainer from 'modules/partner/form/container';
import { StickyScrollingSection } from 'components/Sections';
import StaffGridView from 'modules/staff/list/StaffGridView';
import { usersQuery } from 'graphql/staff/query';
import useQueryList from 'hooks/useQueryList';

const StaffSection = () => {
  const { state } = PartnerFormContainer.useContainer();

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    usersQuery,
    {
      variables: {
        filterBy: { organizationId: state.organization?.id },
        sortBy: { updatedAt: 'DESCENDING' },
        page: 1,
        perPage: 10,
      },
      fetchPolicy: 'network-only',
    },
    'users'
  );

  return (
    <StickyScrollingSection
      sectionHeader={
        <SectionHeader
          icon="STAFF"
          title={
            <>
              <FormattedMessage id="modules.Partner.staffSection" defaultMessage="Staff" /> (
              <FormattedNumber value={nodes?.length ?? 0} />)
            </>
          }
        />
      }
    >
      <StaffGridView
        hasMore={hasMore}
        isLoading={loading}
        onLoadMore={loadMore}
        items={nodes}
        padding="30px 20px"
      />
    </StickyScrollingSection>
  );
};

export default StaffSection;
