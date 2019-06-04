// @flow
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import BaseCard, { GrayCard } from 'components/Cards';
import { Blackout } from 'components/Form';
import { isForbidden } from 'utils/data';

type OptionsType = {
  width: string,
  height: string,
  entityIcon: string,
  entityColor: string,
};

export default function withForbiddenCard(
  Card: React.ComponentType<any>,
  dataField: string,
  { width, height, entityIcon, entityColor }: OptionsType
) {
  return function ParsedForbiddenCard(props: any) {
    const { [dataField]: data, ...rest } = props;

    if (!data) {
      return <GrayCard width={width} height={height} />;
    }

    if (isForbidden(data)) {
      return (
        <BaseCard icon={entityIcon} color={entityColor} {...rest}>
          <Blackout width={width} height={height} />
        </BaseCard>
      );
    }

    return <Card {...props} />;
  };
}
