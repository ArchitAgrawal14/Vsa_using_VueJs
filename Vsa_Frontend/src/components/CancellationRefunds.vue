<template>
  <div class="cancellation-refunds-container">
    <div class="policy-card">
      <h2 class="policy-header">Cancellation and Refunds</h2>
      <div class="policy-content">
        <ul class="policy-list">
          <li class="policy-item">
            <strong>VSA Cancellations:</strong>
            If a program is canceled by VSA, participants may choose a full refund or an alternative program.
          </li>
          <li class="policy-item">
            <strong>Voluntary Cancellations:</strong>
            Refunds are not provided for voluntary cancellations or withdrawals after the program has begun.
          </li>
          <li class="policy-item">
            <strong>Medical Emergencies:</strong>
            Refund requests for medical emergencies will be reviewed on a case-by-case basis and must be supported by relevant documentation.
          </li>
          <li class="policy-item">
            <strong>Processing Time:</strong>
            Approved refunds will be processed within 15 working days.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CancellationRefunds',
  data() {
    return {
      // Component data can be added here if needed
    }
  }
}
</script>

<style scoped>
.cancellation-refunds-container {
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