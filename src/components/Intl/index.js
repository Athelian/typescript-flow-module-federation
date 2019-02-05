// @flow
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
  children: Function,
};
const Intl = (props: Props) => props.children({ intl: props.intl });

export default injectIntl(Intl);
