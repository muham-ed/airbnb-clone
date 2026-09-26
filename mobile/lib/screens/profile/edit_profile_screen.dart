import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/config/api_config.dart';
import '../../core/services/api_service.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _nameController = TextEditingController();
  final _avatarController = TextEditingController();
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
      _avatarController.text = user.avatar ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _avatarController.dispose();
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final body = <String, dynamic>{
        'name': _nameController.text.trim(),
        if (_avatarController.text.trim().isNotEmpty) 'avatar': _avatarController.text.trim(),
      };

      if (_newPasswordController.text.isNotEmpty) {
        body['oldPassword'] = _oldPasswordController.text;
        body['newPassword'] = _newPasswordController.text;
      }

      await ApiService.put(ApiConfig.userProfile, body);

      if (mounted) {
        await Provider.of<AuthProvider>(context, listen: false).fetchProfile();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('تم تحديث البيانات الشخصية بنجاح')),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString().replaceAll('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('تعديل البيانات الشخصية')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'الاسم الكامل',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (v) => (v == null || v.trim().length < 2) ? 'أدخل اسماً صحيحاً' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _avatarController,
                decoration: const InputDecoration(
                  labelText: 'رابط الصورة الشخصية (URL)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.image_outlined),
                ),
              ),
              const Divider(height: 40),
              const Text(
                'تغيير كلمة المرور (اختياري)',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _oldPasswordController,
                decoration: const InputDecoration(
                  labelText: 'كلمة المرور القديمة',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock_clock_outlined),
                ),
                obscureText: true,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _newPasswordController,
                decoration: const InputDecoration(
                  labelText: 'كلمة المرور الجديدة',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                obscureText: true,
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF385C),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'حفظ التغيرات',
                        style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.bold),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
