// @flow
import { MessageDescriptor } from 'react-intl';
import type { TooltipType } from 'components/Form/FormTooltip/TooltipIcon/type.js.flow';

export type DisplayProps<T, E = any> = {|
  value: T,
  entity: {
    id: string,
    type: string,
  } | null,
  extra: E,
|};

export type TooltipProps = {
  message: MessageDescriptor,
  type: TooltipType,
};
