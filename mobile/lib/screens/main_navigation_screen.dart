import 'package:flutter/material.dart';
import 'home/home_screen.dart';
import 'wishlists/wishlists_screen.dart';
import 'bookings/my_bookings_screen.dart';
import 'profile/profile_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    WishlistsScreen(),
    MyBookingsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFFFF385C),
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'استكشاف',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite_border),
            label: 'المفضلات',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            label: 'حجوزاتي',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'الملف الشخصي',
          ),
        ],
      ),
    );
  }
}
