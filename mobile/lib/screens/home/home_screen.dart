import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/listing_provider.dart';
import '../listings/listing_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ListingProvider>(context, listen: false).fetchListings();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch() {
    final query = _searchController.text.trim();
    Provider.of<ListingProvider>(context, listen: false).fetchListings(location: query);
  }

  @override
  Widget build(BuildContext context) {
    final listingProvider = Provider.of<ListingProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(30),
          ),
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'إلى أين تريد الذهاب؟',
              border: InputBorder.none,
              icon: const Icon(Icons.search, color: Color(0xFFFF385C)),
              suffixIcon: IconButton(
                icon: const Icon(Icons.tune),
                onPressed: _onSearch,
              ),
            ),
            onSubmitted: (_) => _onSearch(),
          ),
        ),
      ),
      body: listingProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFFF385C)))
          : listingProvider.errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(listingProvider.errorMessage!),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () => listingProvider.fetchListings(),
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                )
              : listingProvider.listings.isEmpty
                  ? const Center(child: Text('لا توجد عقارات متاحة حالياً'))
                  : RefreshIndicator(
                      onRefresh: () => listingProvider.fetchListings(),
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: listingProvider.listings.length,
                        itemBuilder: (context, index) {
                          final listing = listingProvider.listings[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => ListingDetailScreen(listing: listing),
                                ),
                              );
                            },
                            child: Card(
                              margin: const EdgeInsets.only(bottom: 20),
                              clipBehavior: Clip.antiAlias,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    height: 220,
                                    width: double.infinity,
                                    child: listing.images.isNotEmpty
                                        ? CachedNetworkImage(
                                            imageUrl: listing.images.first,
                                            fit: BoxFit.cover,
                                            placeholder: (c, u) => Container(color: Colors.grey[300]),
                                            errorWidget: (c, u, e) => const Icon(Icons.home, size: 60),
                                          )
                                        : Container(
                                            color: Colors.grey[300],
                                            child: const Icon(Icons.home, size: 60, color: Colors.grey),
                                          ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Expanded(
                                              child: Text(
                                                listing.title,
                                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                            const Row(
                                              children: [
                                                Icon(Icons.star, color: Colors.amber, size: 18),
                                                SizedBox(width: 4),
                                                Text('4.9', style: TextStyle(fontWeight: FontWeight.bold)),
                                              ],
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          listing.location,
                                          style: TextStyle(color: Colors.grey[600]),
                                        ),
                                        const SizedBox(height: 10),
                                        RichText(
                                          text: TextSpan(
                                            style: const TextStyle(color: Colors.black, fontSize: 16),
                                            children: [
                                              TextSpan(
                                                text: '\$${listing.price.toStringAsFixed(0)} ',
                                                style: const TextStyle(fontWeight: FontWeight.bold),
                                              ),
                                              const TextSpan(text: '/ ليلة'),
                                            ],
                                          ),
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
}
