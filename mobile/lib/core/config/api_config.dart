import 'package:flutter/foundation.dart';

class ApiConfig {
  /// Base URL for all API requests.
  ///
  /// - Web (Chrome): uses localhost, since the browser runs on the same machine.
  /// - Android (real device): uses the laptop's LAN IP so the phone can reach
  ///   the backend over Wi-Fi.
  /// - Android Emulator: uses 10.0.2.2 which maps to the host's localhost.
  static String get baseUrl {
    if (kIsWeb) {
      // Running in Chrome on the laptop itself
      return 'http://localhost:5000/api/v1';
    }

    // Real Android device on the same Wi-Fi network as the laptop
    return 'http://192.168.1.19:5000/api/v1';

    // If you ever switch back to the Android Emulator, use this instead:
    // return 'http://10.0.2.2:5000/api/v1';
  }

  // ============ Auth ============
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get refresh => '$baseUrl/auth/refresh';
  static String get logout => '$baseUrl/auth/logout';

  // ============ Profile ============
  static String get userProfile => '$baseUrl/users/me';

  // ============ Listings ============
  static String get listings => '$baseUrl/listings';
  static String get myListings => '$baseUrl/listings/my-listings';

  static String listingById(String id) => '$baseUrl/listings/$id';

  // ============ Bookings ============
  static String get bookings => '$baseUrl/bookings';
  static String get myBookings => '$baseUrl/bookings/my-bookings';

  static String bookingById(String id) => '$baseUrl/bookings/$id';

  // ============ Wishlists ============
  static String get wishlists => '$baseUrl/wishlists';

  static String wishlistById(String id) => '$baseUrl/wishlists/$id';

  // ============ Upload ============
  static String get uploadSingle => '$baseUrl/upload/single';
  static String get uploadMultiple => '$baseUrl/upload/multiple';
}