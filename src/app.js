const form = document.querySelector("#calculator-form");
const total = document.querySelector("#total");
const error = document.querySelector("#error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  const amount = form.elements.amount.value;
  const taxRate = Number(form.elements.taxRate.value) / 100;

  try {
    const response = await fetch(`/api/total?amount=${encodeURIComponent(amount)}&taxRate=${encodeURIComponent(taxRate)}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    total.value = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(result.total);
  } catch (problem) {
    error.textContent = problem.message || "Unable to calculate the total.";
  }
});
