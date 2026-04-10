import { AccessoriesSection } from "@/components/home/accessories-section";
import { AdvantagesCapabilitiesSection } from "@/components/home/advantages-capabilities-section";
import { CustomerReviewsSection } from "@/components/home/customer-reviews-section";
import { DeliveryPaymentSection } from "@/components/home/delivery-payment-section";
import { DevicesSection } from "@/components/home/devices-section";
import { OrderNowSection } from "@/components/home/order-now-section";

export default function HomePage() {
  return (
    <div className="py-8 md:py-10">
      <DevicesSection />
      <AccessoriesSection />
      <AdvantagesCapabilitiesSection />
      <DeliveryPaymentSection />
      <OrderNowSection />
      <CustomerReviewsSection />
    </div>
  );
}
