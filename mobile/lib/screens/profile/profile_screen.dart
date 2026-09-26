import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';
import 'edit_profile_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(title: const Text('الملف الشخصي')),
      body: authProvider.isAuthenticated && user != null
          ? ListView(
              padding: const EdgeInsets.all(24.0),
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 36,
                      backgroundImage: user.avatar != null && user.avatar!.isNotEmpty ? NetworkImage(user.avatar!) : null,
                      child: user.avatar == null || user.avatar!.isEmpty ? const Icon(Icons.person, size: 36) : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user.name,
                            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            user.email,
                            style: const TextStyle(color: Colors.grey),
                          ),
                          Chip(
                            label: Text(user.role),
                            backgroundColor: Colors.grey[200],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 40),
                ListTile(
                  leading: const Icon(Icons.edit_outlined),
                  title: const Text('تعديل البيانات الشخصية'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const EditProfileScreen()),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.security_outlined),
                  title: const Text('الأمان وكلمة المرور'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const EditProfileScreen()),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.help_outline),
                  title: const Text('المساعدة والدعم'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
                const Divider(height: 40),
                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text('تسجيل الخروج', style: TextStyle(color: Colors.red)),
                  onTap: () async {
                    await authProvider.logout();
                  },
                ),
              ],
            )
          : Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.account_circle_outlined, size: 80, color: Colors.grey),
                  const SizedBox(height: 16),
                  const Text(
                    'قم بتسجيل الدخول للوصول لملفك الشخصي',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF385C)),
                    child: const Text('تسجيل الدخول', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
    );
  }
}
