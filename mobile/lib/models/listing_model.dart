class ListingModel {
  final String id;
  final String title;
  final String description;
  final double price;
  final String location;
  final double? latitude;
  final double? longitude;
  final int maxGuests;
  final int bedrooms;
  final int beds;
  final double bathrooms;
  final double cleaningFee;
  final List<String> images;
  final List<String> amenities;
  final bool available;
  final String hostId;
  final String? hostName;
  final String? hostAvatar;

  ListingModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.location,
    this.latitude,
    this.longitude,
    this.maxGuests = 2,
    this.bedrooms = 1,
    this.beds = 1,
    this.bathrooms = 1.0,
    this.cleaningFee = 0.0,
    required this.images,
    required this.amenities,
    this.available = true,
    required this.hostId,
    this.hostName,
    this.hostAvatar,
  });

  factory ListingModel.fromJson(Map<String, dynamic> json) {
    var imagesList = json['images'] is List ? List<String>.from(json['images']) : <String>[];
    var amenitiesList = json['amenities'] is List ? List<String>.from(json['amenities']) : <String>[];

    return ListingModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      location: json['location'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      maxGuests: json['maxGuests'] ?? 2,
      bedrooms: json['bedrooms'] ?? 1,
      beds: json['beds'] ?? 1,
      bathrooms: (json['bathrooms'] as num?)?.toDouble() ?? 1.0,
      cleaningFee: (json['cleaningFee'] as num?)?.toDouble() ?? 0.0,
      images: imagesList,
      amenities: amenitiesList,
      available: json['available'] ?? true,
      hostId: json['hostId'] ?? '',
      hostName: json['host']?['name'],
      hostAvatar: json['host']?['avatar'],
    );
  }
}
