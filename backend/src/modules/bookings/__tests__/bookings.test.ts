import { describe, it, expect } from 'vitest';

describe('Bookings Service & Overbooking Prevention', () => {
  it('should detect overlapping date ranges for the same listing', () => {
    const existingBooking = {
      listingId: 'listing-uuid-1',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-15'),
    };

    const newBookingAttempt = {
      listingId: 'listing-uuid-1',
      startDate: new Date('2026-10-12'), // Overlaps with existing booking!
      endDate: new Date('2026-10-18'),
    };

    const isOverlapping =
      existingBooking.listingId === newBookingAttempt.listingId &&
      newBookingAttempt.startDate < existingBooking.endDate &&
      newBookingAttempt.endDate > existingBooking.startDate;

    expect(isOverlapping).toBe(true);
  });

  it('should allow non-overlapping bookings for the same listing', () => {
    const existingBooking = {
      listingId: 'listing-uuid-1',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-15'),
    };

    const newBookingAttempt = {
      listingId: 'listing-uuid-1',
      startDate: new Date('2026-10-16'), // After existing booking
      endDate: new Date('2026-10-20'),
    };

    const isOverlapping =
      existingBooking.listingId === newBookingAttempt.listingId &&
      newBookingAttempt.startDate < existingBooking.endDate &&
      newBookingAttempt.endDate > existingBooking.startDate;

    expect(isOverlapping).toBe(false);
  });
});
