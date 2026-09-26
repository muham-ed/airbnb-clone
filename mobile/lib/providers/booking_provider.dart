import 'package:flutter/material.dart';
import '../core/config/api_config.dart';
import '../core/services/api_service.dart';
import '../models/booking_model.dart';

class BookingProvider extends ChangeNotifier {
  List<BookingModel> _bookings = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<BookingModel> get bookings => _bookings;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchMyBookings() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiService.get(ApiConfig.myBookings);
      final List rawBookings = response['data'] ?? response['results'] ?? [];

      _bookings = rawBookings.map((item) => BookingModel.fromJson(item)).toList();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createBooking(String listingId, DateTime startDate, DateTime endDate) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await ApiService.post(ApiConfig.bookings, {
        'listingId': listingId,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
      });

      await fetchMyBookings();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
