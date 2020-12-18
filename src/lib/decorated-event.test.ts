import {DateTime} from 'luxon';
import DecoratedEvent from './decorated-event';

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

  it('returns false if the other date ends after it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const date = currentTime.plus({ hours: 2 });
    expect(a.endsAfter(date)).toEqual(false);
  });

  it('return true if the other date ends before it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const date = currentTime.plus({ hours: .5 });
    expect(a.endsAfter(date)).toEqual(true);
  });
});

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

  it('returns true when the date is within the event', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = currentTime;
    const c = currentTime.plus({ hours: 1 });
    const d = currentTime.plus({ minutes: 1 });
    expect(a.overlaps(b)).toEqual(true);
    expect(a.overlaps(c)).toEqual(true);
    expect(a.overlaps(d)).toEqual(true);
  });

  it('returns false when the date is outside the event', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = currentTime.minus({ millisecond: 1 });
    expect(a.overlaps(b)).toEqual(false);
  });
});

describe('startsBefore', () => {
  it('returns false if the other event starts before it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = new DecoratedEvent({
      start: currentTime.minus({ hours: 1 }),
      end: currentTime.plus({ hours: 2 })
    });
    expect(a.startsBefore(b)).toEqual(false);
  });

  it('return true if the other event starts after it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const b = new DecoratedEvent({
      start: currentTime.plus({ hours: .5 }),
      end: currentTime.minus({ hours: 1 })
    });
    expect(a.startsBefore(b)).toEqual(true);
  });

  it('returns false if the other date starts before it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const date = currentTime.minus({ hours: 2 });
    expect(a.startsBefore(date)).toEqual(false);
  });

  it('return true if the other date starts after it', () => {
    const currentTime = DateTime.local();
    const a = new DecoratedEvent({
      start: currentTime,
      end: currentTime.plus({ hours: 1 })
    });
    const date = currentTime.plus({ hours: .5 });
    expect(a.startsBefore(date)).toEqual(true);
  });
});
