import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingsService } from './bookings.service';
import prisma from '../../shared/config/database';

vi.mock('../../shared/config/database', () => ({
  default: {
    $transaction: vi.fn(),
    booking: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    listing: {
      findUnique: vi.fn(),
    },
  },
}));

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(() => {
    service = new BookingsService();
    vi.clearAllMocks();
  });

  it('يجب أن يرمي خطأ إذا كان العقار محجوزاً في نفس التواريخ', async () => {
    const mockData = {
      listingId: 'listing-1',
      guestId: 'guest-1',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-05'),
    };

    // محاكاة وجود حجز متداخل
    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      return callback({
        booking: {
          findFirst: vi.fn().mockResolvedValue({ id: 'existing-booking' }),
        },
      });
    });

    await expect(service.createBooking(mockData)).rejects.toThrow('هذا العقار محجوز بالفعل في هذه التواريخ');
  });

  it('يجب أن ينشئ حجزاً بنجاح إذا كانت التواريخ متاحة', async () => {
    const mockData = {
      listingId: 'listing-1',
      guestId: 'guest-1',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-05'),
    };

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      return callback({
        booking: {
          findFirst: vi.fn().mockResolvedValue(null), // لا يوجد تداخل
          create: vi.fn().mockResolvedValue({ id: 'new-booking', ...mockData }),
        },
        listing: {
          findUnique: vi.fn().mockResolvedValue({ price: 100 }),
        },
      });
    });

    const result = await service.createBooking(mockData);
    expect(result).toBeDefined();
    expect(result.id).toBe('new-booking');
  });
});
