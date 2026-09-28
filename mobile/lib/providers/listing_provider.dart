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

  List<ListingModel> _myListings = [];
  List<ListingModel> get myListings => _myListings;

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

  Future<void> fetchMyListings() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiService.get(ApiConfig.myListings);
      final List rawListings = response['data'] ?? [];
      _myListings = rawListings.map((item) => ListingModel.fromJson(item)).toList();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createListing(Map<String, dynamic> listingData) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await ApiService.post(ApiConfig.listings, listingData);
      await fetchListings();
      await fetchMyListings();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> deleteListing(String id) async {
    try {
      await ApiService.delete('${ApiConfig.listings}/$id');
      _myListings.removeWhere((item) => item.id == id);
      _listings.removeWhere((item) => item.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
      return false;
    }
  }
}
