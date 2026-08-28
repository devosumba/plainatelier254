export type DeliveryOptionId = "cbd-pickup" | "nairobi-outskirts";

export type DeliveryOption = {
  id: DeliveryOptionId;
  label: string;
  description: string;
  fee: number;
};

export const deliveryOptions: DeliveryOption[] = [
  {
    id: "cbd-pickup",
    label: "Pick Up in CBD",
    description: "Collect your order from our Nairobi CBD pickup point.",
    fee: 200,
  },
  {
    id: "nairobi-outskirts",
    label: "Nairobi Outskirts",
    description: "Delivered to you anywhere in greater Nairobi.",
    fee: 400,
  },
];
