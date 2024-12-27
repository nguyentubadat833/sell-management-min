<script setup lang="ts">
const {orderId} = useRoute().query

function payment() {
  usePaypalButton({
    style: {
      label: 'paypal',
      color: 'blue'
    },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "100.00",
              currency_code: "USD",
            },
            description: "Your order description here"
          }
        ],
      });
    },
    onApprove: async (data, actions) => {
      try {
        const details = await actions.order?.capture();
        console.log('Payment completed successfully:', details);
      } catch (error) {
        console.error('Error capturing payment:', error);
      }
    },

    onError: (err) => {
      console.error("Error during transaction:", err);
    },
  })
}
</script>

<template>
  <div>
    <div>
      Order Id: {{ orderId }}
    </div>
    <UButton label="Payment" @click="payment"/>
    <div id="paypal-checkout">
      Paypal out
    </div>
  </div>
</template>

<style scoped>

</style>