import 'package:flutter/foundation.dart';

class ApiConfig {
  /// Base URL for all API requests.
  ///
  /// Priority:
  /// 1. If running in Chrome (web) → uses `localhost`, since the browser
  ///    runs on the same machine as the backend.
  /// 2. Otherwise (real Android device / emulator) → uses `API_HOST`
  ///    which is set at build time via `--dart-define=API_HOST=...`.
  ///
  /// Build examples:
  ///   flutter build apk --release --dart-define=API_HOST=192.168.137.1
  ///   flutter build apk --release --dart-define=API_HOST=192.168.1.19
  ///
  /// If you don't pass `--dart-define`, the default below is used.
  static const String _defaultHost = '192.168.1.19';
  static const String _apiHost =
      String.fromEnvironment('API_HOST', defaultValue: _defaultHost);
  static const int _apiPort =
      int.fromEnvironment('API_PORT', defaultValue: 5000);

  static String get baseUrl {
    // Web: backend runs on the same machine as the browser
    if (kIsWeb) {
      return 'http://localhost:$_apiPort/api/v1';
    }

    // Real Android device / emulator: use the configured host
    return 'http://$_apiHost:$_apiPort/api/v1';
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