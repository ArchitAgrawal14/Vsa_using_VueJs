<template>
  <div class="privacy-policy-container">
    <div class="policy-card">
      <h2 class="policy-header">Privacy Policy</h2>
      <div class="policy-content">
        <ul class="policy-list">
          <li class="policy-item">
            <strong>Data Collection & Usage:</strong>
            Vaibhav Skating Academy (VSA) values customer privacy. Personal information collected during purchases and account registration is used solely for order processing, communication, and internal purposes.
          </li>
          <li class="policy-item">
            <strong>Information We Collect:</strong>
            When you purchase from our store, we collect personal information such as your name, address, and email as part of the buying and selling process.
          </li>
          <li class="policy-item">
            <strong>Data Sharing:</strong>
            We do not share customer data with third parties without consent, except where required by law.
          </li>
          <li class="policy-item">
            <strong>Email Marketing:</strong>
            With your permission, we may send emails about new products, promotions, and other updates.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      // Component data can be added here if needed
    }
  }
}
</script>

<style scoped>
.privacy-policy-container {
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

.policy-item strong {
  color: #333333;
  display: block;
  margin-bottom: 8px;
}

.policy-item:hover {
  background-color: #f5f5f5;
  border-left-color: #bbb;
  transition: all 0.3s ease;
}
</style>