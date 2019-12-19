// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { MilestoneCard } from 'components/Cards';
import { useEntityHasPermissions } from 'contexts/Permissions';
import { MILESTONE_FORM } from 'modules/permission/constants/milestone';

type Props = {
  milestone: Object,
};

const ParentMilestoneCard = ({ milestone }: Props) => {
  const hasPermissions = useEntityHasPermissions(milestone);

  return (
    <MilestoneCard
      milestone={milestone}
      onClick={() => {
        if (hasPermissions(MILESTONE_FORM) && !!milestone?.id) {
          navigate(`/project/${encodeId(milestone?.project?.id)}`);
        }
      }}
    />
  );
};

export default ParentMilestoneCard;
