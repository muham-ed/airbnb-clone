import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart' as intl;
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/booking_provider.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (authProvider.isAuthenticated) {
        Provider.of<BookingProvider>(context, listen: false).fetchMyBookings();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final bookingProvider = Provider.of<BookingProvider>(context);

    if (!authProvider.isAuthenticated) {
      return Scaffold(
        appBar: AppBar(title: const Text('حجوزاتي')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.receipt_long_outlined, size: 80, color: Colors.grey),
              const SizedBox(height: 16),
              const Text(
                'سجل الدخول لعرض قائمة حجوزاتك',
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('حجوزاتي'),
      ),
      body: bookingProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFFF385C)))
          : bookingProvider.errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(bookingProvider.errorMessage!),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () => bookingProvider.fetchMyBookings(),
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                )
              : bookingProvider.bookings.isEmpty
                  ? const Center(child: Text('لا توجد لديك حجوزات حالياً'))
                  : RefreshIndicator(
                      onRefresh: () => bookingProvider.fetchMyBookings(),
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: bookingProvider.bookings.length,
                        itemBuilder: (context, index) {
                          final booking = bookingProvider.bookings[index];
                          final dateFormat = intl.DateFormat('yyyy/MM/dd');

                          return Card(
                            margin: const EdgeInsets.only(bottom: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            elevation: 2,
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: SizedBox(
                                      width: 90,
                                      height: 90,
                                      child: booking.listingImage != null
                                          ? CachedNetworkImage(
                                              imageUrl: booking.listingImage!,
                                              fit: BoxFit.cover,
                                            )
                                          : Container(
                                              color: Colors.grey[300],
                                              child: const Icon(Icons.home, color: Colors.grey),
                                            ),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          booking.listingTitle,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          '${dateFormat.format(booking.startDate)} - ${dateFormat.format(booking.endDate)}',
                                          style: TextStyle(color: Colors.grey[600], fontSize: 13),
                                        ),
                                        const SizedBox(height: 6),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              '\$${booking.totalPrice.toStringAsFixed(0)}',
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                                color: Color(0xFFFF385C),
                                              ),
                                            ),
                                            _buildStatusChip(booking.status),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    String label;

    switch (status.toLowerCase()) {
      case 'confirmed':
        color = Colors.green;
        label = 'مؤكد';
        break;
      case 'pending':
        color = Colors.orange;
        label = 'قيد الانتظار';
        break;
      case 'cancelled':
        color = Colors.red;
        label = 'ملغى';
        break;
      default:
        color = Colors.blue;
        label = status;
    }

    return Chip(
      label: Text(label, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
      backgroundColor: color,
      padding: EdgeInsets.zero,
      visualDensity: VisualDensity.compact,
    );
  }
}
