import {DateTime} from 'luxon';
import * as React from 'react';
import DatePicker from 'react-datepicker';

interface TimeBoundaryProps {
  start: DateTime;
  end: DateTime;
  onStartChanged(dateTime: DateTime): void;
  onEndChanged(dateTime: DateTime): void;
}

const TimeBoundary: React.FC<TimeBoundaryProps> = ({
  start,
  end,
  onStartChanged,
  onEndChanged,
}) => {

  const handleStartDateChange = (date: Date) =>
    onStartChanged(DateTime.fromJSDate(date).startOf('day'));

  const handleEndDateChange = (date: Date) =>
    onEndChanged(DateTime.fromJSDate(date).endOf('day'));

  return (
    <>
      <h2>Boundary</h2>
      <label htmlFor="startDateTime">Start</label>
      <br />
      <DatePicker
        id="startDateTime"
        selected={start.toJSDate()}
        onChange={handleStartDateChange}
      />
      <br />
      <label htmlFor="endDateTime">End</label>
      <br />
      <DatePicker
        id="endDateTime"
        selected={end.toJSDate()}
        onChange={handleEndDateChange}
      />
      <br />
    </>
  );
};

export default TimeBoundary;
