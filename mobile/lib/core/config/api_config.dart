class ApiConfig {
  // للأن Android Emulator يستخدم 10.0.2.2 للوصول لـ localhost الجهاز
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1';

  // Auth
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';

  // Profile
  static const String userProfile = '$baseUrl/users/me';

  // Listings
  static const String listings = '$baseUrl/listings';
  static const String myListings = '$baseUrl/listings/my-listings';

  // Bookings
  static const String bookings = '$baseUrl/bookings';
  static const String myBookings = '$baseUrl/bookings/my-bookings';

  // Wishlists
  static const String wishlists = '$baseUrl/wishlists';

  // Upload
  static const String uploadSingle = '$baseUrl/upload/single';
  static const String uploadMultiple = '$baseUrl/upload/multiple';
}
