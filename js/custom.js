/* =========================================================
   Diamond Athuruga - site scripts
   Rewritten to be page-safe: every feature checks that the
   elements it needs actually exist before running, so a single
   missing element can never halt the rest of the script.
   ========================================================= */

/* ---------- helpers ---------- */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function updateCurrencySymbol() {
  const currencySelect = document.getElementById("currency-select");
  const icon = document.getElementById("currency-icon");
  const amount = document.getElementById("amount");
  if (!currencySelect) return;

  const selectedOption = currencySelect.options[currencySelect.selectedIndex];
  const symbol = selectedOption ? selectedOption.getAttribute("data-symbol") : "";
  if (icon && symbol) icon.innerText = symbol;
  if (amount) amount.setAttribute("placeholder", "Enter amount in " + currencySelect.value);
}

/* ---------- current year (footer) ---------- */
(function setYear() {
  const yearEl = document.getElementById("displayYear");
  if (yearEl) yearEl.innerHTML = new Date().getFullYear();
})();

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Payment page: prefill from URL + currency symbol ---------- */
  (function initPaymentPrefill() {
    const quotationID = getQueryParam("quotationID");
    const name = getQueryParam("name");
    const currency = getQueryParam("currency");
    const amount = getQueryParam("amount");

    const idField = document.getElementById("quotation-id");
    const nameField = document.getElementById("name");
    const currencyField = document.getElementById("currency-select");
    const amountField = document.getElementById("amount");

    if (idField && quotationID) idField.value = quotationID;
    if (nameField && name) nameField.value = name;
    if (currencyField && currency) currencyField.value = currency;
    if (amountField && amount) amountField.value = amount;

    if (currencyField) {
      updateCurrencySymbol();
      currencyField.addEventListener("change", updateCurrencySymbol);
    }
  })();

  /* ---------- Quotation / contact form (Formspree) ---------- */
  (function initQuotationForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const modal = document.getElementById("thank-you-modal");
    if (modal) {
      const closeButton = modal.querySelector(".close-button");
      if (closeButton) {
        closeButton.addEventListener("click", () => (modal.style.display = "none"));
      }
      window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
      });
    }

    // Keep the dropdown buttons' labels in sync with what is ticked.
    function refreshDropdownLabels() {
      form.querySelectorAll(".button-group").forEach((group) => {
        const btn = group.querySelector(".dropdown-toggle .caret") ||
                    group.querySelector(".dropdown-toggle");
        const checked = group.querySelectorAll("input[type='checkbox']:checked");
        if (!btn) return;
        const base = btn.getAttribute("data-label") || btn.textContent.trim();
        btn.setAttribute("data-label", base);
        btn.textContent = checked.length ? base + " (" + checked.length + ")" : base;
      });
    }
    form.querySelectorAll(".button-group input[type='checkbox']").forEach((cb) =>
      cb.addEventListener("change", refreshDropdownLabels)
    );

    // Stop the dropdown from closing when a checkbox is clicked.
    form.querySelectorAll(".dropdown-menu").forEach((menu) =>
      menu.addEventListener("click", (e) => e.stopPropagation())
    );

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.original = submitBtn.textContent;
        submitBtn.textContent = "Sending…";
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            if (modal) modal.style.display = "block";
            else alert("Thank you! Your request has been sent. We'll be in touch shortly.");
            form.reset();
            refreshDropdownLabels();
          } else {
            response.json().then((data) => {
              alert(data.errors ? data.errors.map((e) => e.message).join(", ")
                                : "Oops! There was a problem sending your request.");
            });
          }
        })
        .catch(() => alert("Oops! There was a problem submitting your form. Please try again or contact us directly."))
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.original || "Send";
          }
        });
    });
  })();

  /* ---------- Payment form (front-end confirmation only) ---------- */
  (function initPaymentForm() {
    const form = document.getElementById("payment-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const id = (document.getElementById("quotation-id") || {}).value || "";
      const name = (document.getElementById("name") || {}).value || "";
      const amount = (document.getElementById("amount") || {}).value || "";

      if (!id.trim() || !name.trim() || !amount.trim()) {
        alert("Please fill in your Quotation ID, name and the amount.");
        return;
      }

      const note = document.getElementById("payment-confirm");
      if (note) {
        note.style.display = "block";
        note.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        alert("Thank you, " + name + "! We've received your payment details and will confirm shortly.");
      }
      form.reset();
      updateCurrencySymbol();
    });
  })();

  /* ---------- Newsletter / footer email forms (front-end only) ---------- */
  document.querySelectorAll(".info_form form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value.trim()) {
        input.value = "";
        input.setAttribute("placeholder", "Thanks for subscribing!");
        setTimeout(() => input.setAttribute("placeholder", "Enter Your Email"), 4000);
      }
    });
  });

  /* ---------- International phone input ---------- */
  (function initPhone() {
    const phoneInput = document.querySelector("#phone");
    if (phoneInput && window.intlTelInput) {
      window.intlTelInput(phoneInput, {
        separateDialCode: true,
        preferredCountries: ["lk", "us", "gb", "de"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
    }
  })();

  /* ---------- Leaflet map ---------- */
  (function initMap() {
    const mapEl = document.getElementById("map");
    if (!mapEl || typeof L === "undefined" || mapEl._leaflet_id) return;
    const map = L.map("map").setView([7.8731, 80.7718], 7); // Sri Lanka
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  })();

  /* ---------- Scroll-in animation for car cards ---------- */
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
  }
  function animateBoxes() {
    document.querySelectorAll(".car_section .car_container .box, .car_sectionn .car_container .box")
      .forEach((box) => { if (isInViewport(box)) box.classList.add("animate"); });
  }
  window.addEventListener("scroll", animateBoxes);
  animateBoxes();
});
