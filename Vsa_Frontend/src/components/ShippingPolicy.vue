<template>
  <div class="shipping-policy-container">
    <div class="policy-card">
      <h2 class="policy-header">Shipping Policy</h2>
      <div class="policy-content">
        <ul class="policy-list">
          <li class="policy-item">
            Products ordered through our website are shipped within India.
          </li>
          <li class="policy-item">
            All orders are processed within 8 to 10 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. In case of high demand the order can take up to 14 business days.
          </li>
          <li class="policy-item">
            Delivery typically takes minimum 8 to 10 working days from order confirmation and may take up to a maximum of 14 days.
          </li>
          <li class="policy-item">
            Free local delivery is available for orders over ₹8000 [Within Satna]. For orders under ₹8000, we charge ₹65 for local delivery.
          </li>
          <li class="policy-item">
            <h5 class="subsection-header">In-store pickup</h5>
            <p>You can skip the shipping fees with free local pickup at [Shri Rama krishna college Bharhut Nagar, Satna, Madhya pradesh]. After placing your order and selecting local pickup at checkout, your order will be prepared and ready for pick up within 1 to 2 business days. We will send you an email when your order is ready along with instructions.</p>
            <p>Our in-store pickup hours are [6PM] on [WeekDays]. Please have your order confirmation email with you when you come.</p>
          </li>
          <li class="policy-item">
            No international shipping available right now.
          </li>
          <li class="policy-item">
            Deliveries are made from [9AM - 7PM] on [All Days]. We will contact you via email with the email and phone number you provided at checkout to notify you on the day of our arrival.
          </li>
          <li class="policy-item">
            Shipping charges vary based on the delivery location and are calculated at checkout.
          </li>
          <li class="policy-item">
            VSA is not responsible for shipping delays caused by third-party services.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShippingPolicy',
  data() {
    return {
      // Component data can be added here if needed
    }
  }
}
</script>

<style scoped>
.shipping-policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.policy-card {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.policy-header {
  color: #333333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.policy-content {
  color: #555555;
  line-height: 1.6;
}

.policy-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.policy-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fafafa;
  border-left: 4px solid #ddd;
  border-radius: 4px;
}

.policy-item:hover {
  background-color: #f5f5f5;
  border-left-color: #bbb;
  transition: all 0.3s ease;
}

.subsection-header {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.policy-item p {
  margin: 8px 0;
}
</style>