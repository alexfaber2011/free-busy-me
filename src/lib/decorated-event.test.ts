import {DateTime} from 'luxon';
import DecoratedEvent from './decorated-event';

describe('overlaps', () => {
  it('returns true when an event is within another', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 2 })
    });
    const b = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    expect(a.overlaps(b)).toEqual(true);
  });

  it('returns true when the event starts before it but ends within it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 2 })
    });
    const b = new DecoratedEvent({
      start: currentTime.minus({ hours: 1 }),
      end: currentTime.plus({ hours: 2 })
    });
    expect(a.overlaps(b)).toEqual(true);
  });

  it('returns true when the event starts after it start (but before end) and ends after it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 2 })
    });
    expect(a.overlaps(b)).toEqual(true);
  });

  it('returns false when the events are not overlapping', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = new DecoratedEvent({
      start: currentTime.plus({ hours: 2 }),
      end: currentTime.plus({ hours: 3 })
    });
    expect(a.overlaps(b)).toEqual(false);
  });
});

describe('endsAfter', () => {
  it('returns false if the other event ends after it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 2 })
    });
    expect(a.endsAfter(b)).toEqual(false);
  });

  it('return true if the other event ends before it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = new DecoratedEvent({
      start: currentTime.minus({ hours: 2 }),
      end: currentTime.minus({ hours: 1 })
    });
    expect(a.endsAfter(b)).toEqual(true);
  });
});
