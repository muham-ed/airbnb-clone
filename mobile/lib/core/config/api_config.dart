import 'package:flutter/foundation.dart';

class ApiConfig {
  /// Base URL configuration
  ///
  /// Pass --dart-define=API_HOST=staylock-api.onrender.com for HTTPS production,
  /// or --dart-define=API_HOST=192.168.1.19 for local Wi-Fi testing.
  static const String _defaultHost = '192.168.1.19';
  static const String _apiHost =
      String.fromEnvironment('API_HOST', defaultValue: _defaultHost);
  static const int _apiPort =
      int.fromEnvironment('API_PORT', defaultValue: 5000);

  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:$_apiPort/api/v1';
    }

    // Handle full HTTPS cloud URLs (e.g. Render, ngrok, custom domain)
    if (_apiHost.contains('render.com') ||
        _apiHost.contains('ngrok') ||
        _apiHost.startsWith('https://') ||
        _apiHost.startsWith('http://')) {
      if (_apiHost.startsWith('http://') || _apiHost.startsWith('https://')) {
        return '$_apiHost/api/v1';
      }
      return 'https://$_apiHost/api/v1';
    }

    // Local IP address / LAN Wi-Fi
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
