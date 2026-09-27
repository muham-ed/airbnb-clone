import 'package:flutter_test/flutter_test.dart';
import 'package:airbnb_clone_mobile/main.dart';

void main() {
  testWidgets('AirbnbApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const AirbnbApp());
    expect(find.text('Airbnb Clone'), findsWidgets);
  });
}
