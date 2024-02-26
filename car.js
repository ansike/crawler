const { carRate } = require("./src/config");

const rate5 = 1.2;
for (let i = 200; i <= 30000; i += 100) {
  const basePrice = i / 1.2;
  const prices = carRate.map((car) => {
    const price = Math.floor(car.value * basePrice);
    return `${car.label}: ${price}`;
  });
  const priceStr = prices.join(", ");
  console.log(`${priceStr}`);
//   console.log(`基础报价${basePrice} ${priceStr}`);
}
