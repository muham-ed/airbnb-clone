import prisma from '../../shared/config/database';
import { CreateWishlistInput } from './wishlists.schema';
import { AppError } from '../../shared/utils/app-error';

export class WishlistsService {
  async getMyWishlists(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
                location: true,
                images: true,
                available: true,
              },
            },
          },
        },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWishlistById(id: string, userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!wishlist) {
      throw new AppError('قائمة المفضلات غير موجودة', 404, 'NOT_FOUND');
    }

    if (wishlist.userId !== userId) {
      throw new AppError('لا تملك صلاحية للوصول لهذه القائمة', 403, 'FORBIDDEN');
    }

    return wishlist;
  }

  async createWishlist(userId: string, data: CreateWishlistInput['body']) {
    return prisma.wishlist.create({
      data: {
        userId,
        name: data.name,
      },
    });
  }

  async addItemToWishlist(wishlistId: string, userId: string, listingId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlist) {
      throw new AppError('قائمة المفضلات غير موجودة', 404, 'NOT_FOUND');
    }

    if (wishlist.userId !== userId) {
      throw new AppError('لا تملك صلاحية لإضافة عناصر لهذه القائمة', 403, 'FORBIDDEN');
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new AppError('العقار المراد إضافته غير موجود', 404, 'NOT_FOUND');
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_listingId: {
          wishlistId,
          listingId,
        },
      },
    });

    if (existingItem) {
      throw new AppError('العقار موجود بالفعل في هذه القائمة', 400, 'ITEM_ALREADY_EXISTS');
    }

    return prisma.wishlistItem.create({
      data: {
        wishlistId,
        listingId,
      },
      include: {
        listing: true,
      },
    });
  }

  async removeItemFromWishlist(wishlistId: string, listingId: string, userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId },
    });

    if (!wishlist) {
      throw new AppError('قائمة المفضلات غير موجودة', 404, 'NOT_FOUND');
    }

    if (wishlist.userId !== userId) {
      throw new AppError('لا تملك صلاحية لحذف عناصر من هذه القائمة', 403, 'FORBIDDEN');
    }

    return prisma.wishlistItem.delete({
      where: {
        wishlistId_listingId: {
          wishlistId,
          listingId,
        },
      },
    });
  }

  async deleteWishlist(id: string, userId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id },
    });

    if (!wishlist) {
      throw new AppError('قائمة المفضلات غير موجودة', 404, 'NOT_FOUND');
    }

    if (wishlist.userId !== userId) {
      throw new AppError('لا تملك صلاحية لحذف هذه القائمة', 403, 'FORBIDDEN');
    }

    return prisma.wishlist.delete({ where: { id } });
  }
}
