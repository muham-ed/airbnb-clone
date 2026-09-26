import 'package:flutter/material.dart';
import '../core/config/api_config.dart';
import '../core/services/api_service.dart';
import '../models/listing_model.dart';

class ListingProvider extends ChangeNotifier {
  List<ListingModel> _listings = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<ListingModel> get listings => _listings;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchListings({String? location, double? minPrice, double? maxPrice}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      String url = ApiConfig.listings;
      List<String> queryParams = [];

      if (location != null && location.isNotEmpty) queryParams.add('location=$location');
      if (minPrice != null) queryParams.add('minPrice=$minPrice');
      if (maxPrice != null) queryParams.add('maxPrice=$maxPrice');

      if (queryParams.isNotEmpty) {
        url += '?${queryParams.join('&')}';
      }

      final response = await ApiService.get(url);
      final List rawListings = response['data'] ?? [];

      _listings = rawListings.map((item) => ListingModel.fromJson(item)).toList();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
