class BookingModel {
  final String id;
  final String listingId;
  final String listingTitle;
  final String? listingImage;
  final String listingLocation;
  final DateTime startDate;
  final DateTime endDate;
  final double totalPrice;
  final String currency;
  final String status;
  final DateTime createdAt;

  BookingModel({
    required this.id,
    required this.listingId,
    required this.listingTitle,
    this.listingImage,
    required this.listingLocation,
    required this.startDate,
    required this.endDate,
    required this.totalPrice,
    required this.currency,
    required this.status,
    required this.createdAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    final listing = json['listing'] ?? {};
    final images = listing['images'] is List ? List<String>.from(listing['images']) : <String>[];

    return BookingModel(
      id: json['id'] ?? '',
      listingId: json['listingId'] ?? listing['id'] ?? '',
      listingTitle: listing['title'] ?? 'عقار غير معروف',
      listingImage: images.isNotEmpty ? images.first : null,
      listingLocation: listing['location'] ?? '',
      startDate: DateTime.tryParse(json['startDate'] ?? '') ?? DateTime.now(),
      endDate: DateTime.tryParse(json['endDate'] ?? '') ?? DateTime.now(),
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] ?? 'usd',
      status: json['status'] ?? 'pending',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}
