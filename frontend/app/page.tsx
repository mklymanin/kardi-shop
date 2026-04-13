import { AccessoriesSection } from "@/components/home/accessories-section";
import { AdvantagesCapabilitiesSection } from "@/components/home/advantages-capabilities-section";
import { CustomerReviewsSection } from "@/components/home/customer-reviews-section";
import { DeliveryPaymentSection } from "@/components/home/delivery-payment-section";
import { DevicesSection } from "@/components/home/devices-section";
import { OrderNowSection } from "@/components/home/order-now-section";
import { getCustomerReviews } from "@/lib/api/customer-reviews";

export default async function HomePage() {
  const customerReviews = await getCustomerReviews();

  return (
    <div className="py-8 md:py-10">
      <DevicesSection />
      <AccessoriesSection />
      <AdvantagesCapabilitiesSection />
      <DeliveryPaymentSection />
      <OrderNowSection />
      <CustomerReviewsSection data={customerReviews} />
    </div>
  );
}
