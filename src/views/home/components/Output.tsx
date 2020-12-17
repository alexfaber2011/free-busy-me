import {FreeBusy} from 'lib/calendars';
import * as React from 'react';

interface OutputProps {
  freeBusy: FreeBusy | null;
}

const Output: React.FC<OutputProps> = ({ freeBusy }) => {
  if (freeBusy === null) return <code>Nofing to see &apos;ere</code>;

  return (<pre>{JSON.stringify(freeBusy, null, 2)}</pre>);
};

export default Output;
