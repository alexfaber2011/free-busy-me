import {Group} from 'lib/group-events';
import toHumanFriendly from 'lib/to-human-friendly';
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

  const descriptions = React.useMemo(() => toHumanFriendly(group), [group]);

  const renderDescriptions = () => {
    if (descriptions.length === 0) return 'No events';

    return descriptions.map(description => (
      <li key={description.label}>
        {description.label}: {description.description}
      </li>
    ));
  };

  return (
    <ul>
      {renderDescriptions()}
    </ul>
  );
};

export default Output;
