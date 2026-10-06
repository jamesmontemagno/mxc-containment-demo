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
    if (!response.ok) {
      const problem = await response.json().catch(() => null);
      throw new Error(problem?.error || `Request failed (${response.status}).`);
    }
    const result = await response.json();
    total.value = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(result.total);
  } catch (problem) {
    error.textContent = problem.message || "Unable to calculate the total.";
  }
});
