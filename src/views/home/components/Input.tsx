import * as React from 'react';

interface Calendar {
  color: string;
  enabled: boolean;
  id: string;
  name: string;
}

interface CalendarsProps {
  calendars: Calendar[];
  isLoading: boolean;
  onCalendarToggle(calendarId: string, enabled: boolean): void;
}

const Calendars: React.FC<CalendarsProps> = ({
  calendars,
  isLoading,
  onCalendarToggle
}) => {
  if (isLoading) return <em>Loading...</em>;
  if (calendars.length === 0) return <strong>No calendars</strong>;

  const renderCalendarListItems = () => {
    return calendars.map(calendar => (
      <li key={calendar.id}>
        <input
          id={calendar.id}
          type="checkbox"
          checked={calendar.enabled}
          onChange={() => onCalendarToggle(calendar.id, !calendar.enabled)}
        />
        <label htmlFor={calendar.id}>{calendar.name}</label>
      </li>
    ));
  };

  return (<ul>{renderCalendarListItems()}</ul>);

};

interface InputProps {
  calendarProviderName: string | null;
  calendars: Calendar[];
  isLoading: boolean;
  onCalendarToggle(calendarId: string, enabled: boolean): void;
}

const Input: React.FC<InputProps> = ({
  calendarProviderName,
  calendars,
  isLoading,
  onCalendarToggle,
}) => {

  const renderCalendarProviderName = () => {
    if (isLoading) return <em>Loading...</em>;
    if (calendarProviderName === null) return null;

    return `1 ${calendarProviderName} account`;
  };

  return (
    <>
      <p>The above results are based on...</p>
      <p>{renderCalendarProviderName()}</p>
      <p>with the following calendars...</p>
      <Calendars
        calendars={calendars}
        isLoading={isLoading}
        onCalendarToggle={onCalendarToggle}
      />
    </>
  );
};

export default Input;
