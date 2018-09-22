/**
 * Flowtype definitions for unstated
 * Generated by Flowgen from a Typescript Definition
 * Flowgen v1.2.3
 * Author: [Joar Wilk](http://twitter.com/joarwilk)
 * Repo: http://github.com/joarwilk/flowgen
 */
import * as React from 'react';

declare module 'unstated' {
  declare export class Container<State> {
    state: State;
    setState<K>(
      state: | ((prevState: $ReadOnly<State>) => $Shape<State> | State | null)
        | ($Shape<State> | State | null),
      callback?: () => void
    ): Promise<void>;
    subscribe(fn: () => any): void;
    unsubscribe(fn: () => any): void;
  }
  declare interface ContainerType<State> {
    new(...args: any[]): Container<State>;
  }
  declare interface SubscribeProps {
    to: (ContainerType<any> | Container<any>)[];
    children(...instances: Container<any>[]): React.ReactNode;
  }
  declare export class Subscribe mixins React.Component<SubscribeProps> {}
  declare interface ProviderProps {
    inject?: Container<any>[];
    children: React.ReactNode;
  }
  declare export var Provider: React.StatelessFunctionalComponent<ProviderProps>;
}
