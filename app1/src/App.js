// @flow
import * as React from "react";
import { lazy, Suspense } from "react";

const RemoteButton = lazy(() => import("app2/Button"));

const App = () => {
  return <div>
      <h1>Basic Host-Remote</h1>
      <h2>App 1, uses Flow React</h2>
      <Suspense fallback="Loading Button">
        <RemoteButton text="Hi this text was sent from Flow local" />
      </Suspense>
    </div>;
};

export default App;
