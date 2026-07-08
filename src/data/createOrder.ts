export default function (data: { type: string }) {
  return {
    orderId: `ORDER_${Date.now()}`,
    type: data.type
  };
}