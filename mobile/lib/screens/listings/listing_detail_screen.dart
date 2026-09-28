import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart' as intl;
import '../../models/listing_model.dart';
import '../../providers/booking_provider.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_screen.dart';

class ListingDetailScreen extends StatefulWidget {
  final ListingModel listing;

  const ListingDetailScreen({super.key, required this.listing});

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  DateTimeRange? _selectedDateRange;

  void _openBookingSheet() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    if (!authProvider.isAuthenticated) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('يرجى تسجيل الدخول أولاً لإتمام الحجز')),
      );
      Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final nights = _selectedDateRange != null
              ? _selectedDateRange!.duration.inDays
              : 1;
          final totalPrice = (nights * widget.listing.price) + widget.listing.cleaningFee;

          return Padding(
            padding: EdgeInsets.only(
              left: 20,
              right: 20,
              top: 24,
              bottom: MediaQuery.of(context).viewInsets.bottom + 24,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'تأكيد حجز العقار',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const Divider(),
                const SizedBox(height: 12),
                ListTile(
                  tileColor: Colors.grey[100],
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  leading: const Icon(Icons.calendar_today, color: Color(0xFFFF385C)),
                  title: Text(
                    _selectedDateRange == null
                        ? 'اختر تواريخ الإقامة'
                        : '${intl.DateFormat('yyyy/MM/dd').format(_selectedDateRange!.start)} - ${intl.DateFormat('yyyy/MM/dd').format(_selectedDateRange!.end)}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(_selectedDateRange == null ? 'انقر للتحديد' : 'عدد الليالي: $nights ليلة'),
                  trailing: const Icon(Icons.edit_calendar),
                  onTap: () async {
                    final picked = await showDateRangePicker(
                      context: context,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                      initialDateRange: _selectedDateRange ??
                          DateTimeRange(
                            start: DateTime.now().add(const Duration(days: 1)),
                            end: DateTime.now().add(const Duration(days: 3)),
                          ),
                    );
                    if (picked != null) {
                      setModalState(() {
                        _selectedDateRange = picked;
                      });
                      setState(() {
                        _selectedDateRange = picked;
                      });
                    }
                  },
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('\$${widget.listing.price.toStringAsFixed(0)} x $nights ليلة'),
                          Text('\$${(nights * widget.listing.price).toStringAsFixed(0)}'),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('رسوم التنظيف:'),
                          Text('\$${widget.listing.cleaningFee.toStringAsFixed(0)}'),
                        ],
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'المبلغ الإجمالي:',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            '\$${totalPrice.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFFF385C),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () async {
                      if (_selectedDateRange == null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('يرجى تحديد تواريخ الإقامة أولاً')),
                        );
                        return;
                      }

                      final bookingProvider = Provider.of<BookingProvider>(context, listen: false);
                      final success = await bookingProvider.createBooking(
                        widget.listing.id,
                        _selectedDateRange!.start,
                        _selectedDateRange!.end,
                      );

                      if (mounted) {
                        Navigator.pop(ctx);
                        if (success) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('تم إرسال طلب الحجز بنجاح!'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(bookingProvider.errorMessage ?? 'فشل إتمام الحجز (قد يكون التاريخ محجوزاً)'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF385C),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text(
                      'تأكيد وإتمام الحجز',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _contactHostDialog() {
    final messageController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('التواصل مع المضيف (${widget.listing.hostName ?? 'المضيف'})'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('أرسل رسالتك وسيرد عليك المضيف مباشرة:'),
            const SizedBox(height: 12),
            TextField(
              controller: messageController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'مرحباً، هل الشقة متوفرة في الأسبوع القادم؟',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('إلغاء')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('تم إرسال رسالتك إلى المضيف بنجاح!'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF385C)),
            child: const Text('إرسال', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final listing = widget.listing;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: listing.images.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: listing.images.first,
                      fit: BoxFit.cover,
                    )
                  : Container(color: Colors.grey[300]),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAlignment.start,
                children: [
                  Text(
                    listing.title,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 18, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text(listing.location, style: TextStyle(color: Colors.grey[700], fontSize: 16)),
                    ],
                  ),
                  const Divider(height: 32),
                  if (listing.hostName != null) ...[
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundImage: listing.hostAvatar != null
                              ? NetworkImage(listing.hostAvatar!)
                              : null,
                          child: listing.hostAvatar == null ? const Icon(Icons.person) : null,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAlignment.start,
                            children: [
                              Text(
                                'المضيف: ${listing.hostName}',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              const Text('مضيف متميز ⭐', style: TextStyle(color: Colors.grey)),
                            ],
                          ),
                        ),
                        OutlinedButton.icon(
                          onPressed: _contactHostDialog,
                          icon: const Icon(Icons.chat_bubble_outline, size: 18),
                          label: const Text('تواصل'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFFFF385C),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 32),
                  ],
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildSpecItem(Icons.group_outlined, '${listing.maxGuests} ضيوف'),
                      _buildSpecItem(Icons.king_bed_outlined, '${listing.bedrooms} غرف'),
                      _buildSpecItem(Icons.bathtub_outlined, '${listing.bathrooms} حمام'),
                    ],
                  ),
                  const Divider(height: 32),
                  const Text(
                    'عن هذا العقار',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    listing.description,
                    style: const TextStyle(fontSize: 16, height: 1.5),
                  ),
                  const Divider(height: 32),
                  if (listing.amenities.isNotEmpty) ...[
                    const Text(
                      'المرافق والخدمات',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 12,
                      runSpacing: 8,
                      children: listing.amenities.map((amenity) {
                        return Chip(
                          avatar: const Icon(Icons.check_circle_outline, color: Color(0xFFFF385C)),
                          label: Text(amenity),
                        );
                      }).toList(),
                    ),
                  ],
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    style: const TextStyle(color: Colors.black, fontSize: 20),
                    children: [
                      TextSpan(
                        text: '\$${listing.price.toStringAsFixed(0)} ',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const TextSpan(text: '/ ليلة', style: TextStyle(fontSize: 14)),
                    ],
                  ),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: _openBookingSheet,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF385C),
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text(
                'حجز الآن',
                style: TextStyle(fontSize: 16, color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecItem(IconData icon, String label) {
    return Column(
      children: [
        Icon(icon, size: 28, color: const Color(0xFFFF385C)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
      ],
    );
  }
}
