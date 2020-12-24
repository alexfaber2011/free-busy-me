import {Group} from 'lib/group-events';
import * as React from 'react';

interface OutputProps {
  group: Group[];
  error: string | null;
  renderLoading: boolean;
}

const Output: React.FC<OutputProps> = ({ group, error, renderLoading }) => {
  if (renderLoading) return <code>Hold on, we&apos;e working on it</code>;
  if (error) return <code>Blimey, somefin went wrong</code>;
  if (group.length === 0) return <code>Nofing to see &apos;ere</code>;

  return (<pre>{JSON.stringify(group, null, 2)}</pre>);
};

export default Output;
