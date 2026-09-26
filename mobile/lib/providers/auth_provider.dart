import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/config/api_config.dart';
import '../core/services/api_service.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get errorMessage => _errorMessage;

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final response = await ApiService.post(ApiConfig.login, {
        'email': email,
        'password': password,
      });

      final userData = response['data']['user'];
      final token = response['data']['token'];

      _user = UserModel.fromJson(userData);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', token);

      _setLoading(false);
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> register(String name, String email, String password, String role) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final response = await ApiService.post(ApiConfig.register, {
        'name': name,
        'email': email,
        'password': password,
        'role': role,
      });

      final userData = response['data']['user'];
      final token = response['data']['token'];

      _user = UserModel.fromJson(userData);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', token);

      _setLoading(false);
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _setLoading(false);
      return false;
    }
  }

  Future<void> fetchProfile() async {
    final token = await ApiService.getToken();
    if (token == null) return;

    try {
      final response = await ApiService.get(ApiConfig.userProfile);
      _user = UserModel.fromJson(response['data']['user']);
      notifyListeners();
    } catch (e) {
      await logout();
    }
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
