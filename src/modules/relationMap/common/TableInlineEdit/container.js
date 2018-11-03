// @flow
import { Container } from 'unstated';

type RelationMapTableEditState = {
  expandGroup: string,
};

const initState = {
  expandGroup: '',
};

export default class RelationMapTableEditContainer extends Container<RelationMapTableEditState> {
  state = initState;

  toggleExpandGroup = (expandGroup: string) => {
    if (this.isExpanding(expandGroup)) {
      this.setState({
        expandGroup: '',
      });
    } else {
      this.setState({
        expandGroup,
      });
    }
  };

  isExpanding = (currentExpandingGroup: string) => currentExpandingGroup === this.state.expandGroup;
}
