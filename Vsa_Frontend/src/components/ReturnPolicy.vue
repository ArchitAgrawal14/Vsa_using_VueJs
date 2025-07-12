<template>
  <div class="return-policy-container">
    <div class="policy-card">
      <h2 class="policy-header">Return Policy</h2>
      <div class="policy-content">
        <ol class="policy-list">
          <li class="policy-item">
            <span class="item-number">1.</span>
            <div class="item-content">
              Returns are accepted only for unused and undamaged products within 5 working days of delivery.
            </div>
          </li>
          <li class="policy-item">
            <span class="item-number">2.</span>
            <div class="item-content">
              To initiate a return, participants must contact VSA customer support with proof of purchase and reason for return.
            </div>
          </li>
          <li class="policy-item">
            <span class="item-number">3.</span>
            <div class="item-content">
              The cost of return shipping is the responsibility of the customer unless the product is defective or incorrect. The returns shall only be sent to the provided address by the customer themselves after the approval from VSA.
            </div>
          </li>
          <li class="policy-item">
            <span class="item-number">4.</span>
            <div class="item-content">
              Refunds for approved returns will be processed within 15 working days after the returned product is received and inspected.
            </div>
          </li>
          <li class="policy-item">
            <span class="item-number">5.</span>
            <div class="item-content">
              No returns or refunds will be provided for products that are used, damaged, or do not meet the return criteria.
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReturnPolicy',
  data() {
    return {
      // Component data can be added here if needed
    }
  }
}
</script>

<style scoped>
.return-policy-container {
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
  counter-reset: item-counter;
}

.policy-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fafafa;
  border-left: 4px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
}

.policy-item:hover {
  background-color: #f5f5f5;
  border-left-color: #bbb;
  transition: all 0.3s ease;
}

.item-number {
  background-color: #333333;
  color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 15px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  padding-top: 2px;
}
</style>