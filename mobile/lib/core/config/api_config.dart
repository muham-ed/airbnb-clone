import 'package:flutter/foundation.dart';

class ApiConfig {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api/v1';
    } else {
      return 'http://10.0.2.2:5000/api/v1';
    }
  }

  // Auth
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';

  // Profile
  static String get userProfile => '$baseUrl/users/me';

  // Listings
  static String get listings => '$baseUrl/listings';
  static String get myListings => '$baseUrl/listings/my-listings';

  // Bookings
  static String get bookings => '$baseUrl/bookings';
  static String get myBookings => '$baseUrl/bookings/my-bookings';

  // Wishlists
  static String get wishlists => '$baseUrl/wishlists';

  // Upload
  static String get uploadSingle => '$baseUrl/upload/single';
  static String get uploadMultiple => '$baseUrl/upload/multiple';
}
